import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Create new booking
router.post('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const {
      serviceType, // 'property_viewing', 'construction', 'renovation', etc.
      serviceProviderId,
      propertyId,
      productId,
      scheduledDate,
      scheduledTime,
      duration = 60, // minutes
      notes,
      requirements
    } = req.body;

    // Validate required fields
    if (!serviceType || !scheduledDate || !scheduledTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if service provider exists
    if (serviceProviderId) {
      const providerDoc = await admin.firestore()
        .collection('users')
        .doc(serviceProviderId)
        .get();

      if (!providerDoc.exists) {
        return res.status(404).json({ error: 'Service provider not found' });
      }
    }

    const bookingData = {
      customerId: req.userId,
      serviceProviderId,
      propertyId,
      productId,
      serviceType,
      scheduledDate,
      scheduledTime,
      duration,
      notes: notes || '',
      requirements: requirements || {},
      status: 'pending', // pending, confirmed, ongoing, completed, cancelled
      paymentStatus: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const docRef = await admin.firestore().collection('bookings').add(bookingData);

    res.status(201).json({
      id: docRef.id,
      message: 'Booking created successfully',
      bookingData: {
        ...bookingData,
        id: docRef.id
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Get user's bookings
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, role = 'customer', page = 1, limit = 20 } = req.query;

    let query = admin.firestore().collection('bookings');

    // Filter by user role
    if (role === 'customer') {
      query = query.where('customerId', '==', req.userId);
    } else if (role === 'provider') {
      query = query.where('serviceProviderId', '==', req.userId);
    }

    // Filter by status
    if (status) {
      query = query.where('status', '==', status);
    }

    query = query.orderBy('createdAt', 'desc');

    // Pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query = query.offset(offset).limit(parseInt(limit as string));

    const snapshot = await query.get();
    const bookings = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const bookingData = doc.data();
        
        // Get additional details
        let customerDetails = null;
        let providerDetails = null;
        let propertyDetails = null;

        if (bookingData.customerId) {
          const customerDoc = await admin.firestore()
            .collection('users')
            .doc(bookingData.customerId)
            .get();
          if (customerDoc.exists) {
            const userData = customerDoc.data();
            customerDetails = {
              id: customerDoc.id,
              name: userData?.displayName,
              email: userData?.email,
              phone: userData?.profile?.phone
            };
          }
        }

        if (bookingData.serviceProviderId) {
          const providerDoc = await admin.firestore()
            .collection('users')
            .doc(bookingData.serviceProviderId)
            .get();
          if (providerDoc.exists) {
            const userData = providerDoc.data();
            providerDetails = {
              id: providerDoc.id,
              name: userData?.displayName,
              email: userData?.email,
              phone: userData?.profile?.phone,
              userType: userData?.userType
            };
          }
        }

        if (bookingData.propertyId) {
          const propertyDoc = await admin.firestore()
            .collection('properties')
            .doc(bookingData.propertyId)
            .get();
          if (propertyDoc.exists) {
            const propertyData = propertyDoc.data();
            propertyDetails = {
              id: propertyDoc.id,
              title: propertyData?.title,
              address: propertyData?.address,
              price: propertyData?.price
            };
          }
        }

        return {
          id: doc.id,
          ...bookingData,
          customer: customerDetails,
          provider: providerDetails,
          property: propertyDetails
        };
      })
    );

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Failed to get bookings' });
  }
});

// Get single booking
router.get('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const bookingDoc = await admin.firestore()
      .collection('bookings')
      .doc(req.params.id)
      .get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Check if user is authorized to view this booking
    if (bookingData?.customerId !== req.userId && 
        bookingData?.serviceProviderId !== req.userId) {
      
      // Check if user is admin
      const userDoc = await admin.firestore().collection('users').doc(req.userId!).get();
      if (userDoc.data()?.userType !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to view this booking' });
      }
    }

    res.json({
      id: bookingDoc.id,
      ...bookingData
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Failed to get booking' });
  }
});

// Update booking status
router.patch('/:id/status', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { status, notes } = req.body;
    const bookingId = req.params.id;

    const bookingRef = admin.firestore().collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Check authorization
    const isCustomer = bookingData?.customerId === req.userId;
    const isProvider = bookingData?.serviceProviderId === req.userId;
    
    if (!isCustomer && !isProvider) {
      const userDoc = await admin.firestore().collection('users').doc(req.userId!).get();
      if (userDoc.data()?.userType !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to update this booking' });
      }
    }

    // Validate status transitions
    const validTransitions: { [key: string]: string[] } = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['ongoing', 'cancelled'],
      'ongoing': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };

    const currentStatus = bookingData?.status;
    if (!validTransitions[currentStatus]?.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status transition from ${currentStatus} to ${status}` 
      });
    }

    const updateData: any = {
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (notes) {
      updateData.statusNotes = notes;
    }

    if (status === 'completed') {
      updateData.completedAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await bookingRef.update(updateData);

    // Send notification to the other party
    const recipientId = isCustomer ? bookingData?.serviceProviderId : bookingData?.customerId;
    if (recipientId) {
      await admin.firestore().collection('notifications').add({
        type: 'booking_status_update',
        title: 'Booking Status Updated',
        message: `Booking status changed to ${status}`,
        recipientId,
        data: { bookingId, status },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        read: false
      });
    }

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// Cancel booking
router.delete('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { reason } = req.body;
    const bookingId = req.params.id;

    const bookingRef = admin.firestore().collection('bookings').doc(bookingId);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Check authorization
    if (bookingData?.customerId !== req.userId && 
        bookingData?.serviceProviderId !== req.userId) {
      const userDoc = await admin.firestore().collection('users').doc(req.userId!).get();
      if (userDoc.data()?.userType !== 'admin') {
        return res.status(403).json({ error: 'Not authorized to cancel this booking' });
      }
    }

    // Check if booking can be cancelled
    if (['completed', 'cancelled'].includes(bookingData?.status)) {
      return res.status(400).json({ error: 'Booking cannot be cancelled' });
    }

    await bookingRef.update({
      status: 'cancelled',
      cancellationReason: reason || 'No reason provided',
      cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Process refund if payment was made
    if (bookingData?.paymentStatus === 'completed') {
      // Trigger refund process
      // This would integrate with payment routes
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

// Get available time slots
router.get('/availability/:providerId', async (req, res) => {
  try {
    const { providerId } = req.params;
    const { date, serviceType } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    // Get existing bookings for the date
    const existingBookings = await admin.firestore()
      .collection('bookings')
      .where('serviceProviderId', '==', providerId)
      .where('scheduledDate', '==', date)
      .where('status', 'in', ['confirmed', 'ongoing'])
      .get();

    // Generate available time slots
    const workingHours = {
      start: 9, // 9 AM
      end: 18,  // 6 PM
      slotDuration: 60 // minutes
    };

    const bookedSlots = existingBookings.docs.map(doc => {
      const booking = doc.data();
      return {
        time: booking.scheduledTime,
        duration: booking.duration || 60
      };
    });

    const availableSlots = generateAvailableSlots(workingHours, bookedSlots);

    res.json({ availableSlots });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: 'Failed to get availability' });
  }
});

// Add review for completed booking
router.post('/:id/review', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { rating, comment } = req.body;
    const bookingId = req.params.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Valid rating (1-5) is required' });
    }

    const bookingDoc = await admin.firestore()
      .collection('bookings')
      .doc(bookingId)
      .get();

    if (!bookingDoc.exists) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const bookingData = bookingDoc.data();

    // Only customer can review and only completed bookings
    if (bookingData?.customerId !== req.userId) {
      return res.status(403).json({ error: 'Only customers can review bookings' });
    }

    if (bookingData?.status !== 'completed') {
      return res.status(400).json({ error: 'Can only review completed bookings' });
    }

    // Check if already reviewed
    if (bookingData?.review) {
      return res.status(400).json({ error: 'Booking already reviewed' });
    }

    const reviewData = {
      rating,
      comment: comment || '',
      reviewerId: req.userId,
      reviewedId: bookingData.serviceProviderId,
      bookingId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Add review to reviews collection
    await admin.firestore().collection('reviews').add(reviewData);

    // Update booking with review flag
    await bookingDoc.ref.update({
      review: reviewData,
      reviewedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Failed to add review' });
  }
});

function generateAvailableSlots(workingHours: any, bookedSlots: any[]): string[] {
  const slots: string[] = [];
  const { start, end, slotDuration } = workingHours;

  for (let hour = start; hour < end; hour++) {
    for (let minute = 0; minute < 60; minute += slotDuration) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Check if slot is available
      const isBooked = bookedSlots.some(booked => {
        const bookedTime = booked.time;
        const bookedDuration = booked.duration || 60;
        
        const slotStart = hour * 60 + minute;
        const slotEnd = slotStart + slotDuration;
        
        const bookedStart = parseInt(bookedTime.split(':')[0]) * 60 + parseInt(bookedTime.split(':')[1]);
        const bookedEnd = bookedStart + bookedDuration;
        
        return (slotStart < bookedEnd && slotEnd > bookedStart);
      });

      if (!isBooked) {
        slots.push(timeSlot);
      }
    }
  }

  return slots;
}

export { router as bookingRoutes };