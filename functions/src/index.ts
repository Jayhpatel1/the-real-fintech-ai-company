import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';

// Initialize Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

// Import route handlers
import { authRoutes } from './routes/auth';
import { propertyRoutes } from './routes/properties';
import { productRoutes } from './routes/products';
import { serviceRoutes } from './routes/services';
import { bookingRoutes } from './routes/bookings';
import { chatRoutes } from './routes/chat';
import { paymentRoutes } from './routes/payments';
import { notificationRoutes } from './routes/notifications';
import { adminRoutes } from './routes/admin';

// Mount routes
app.use('/auth', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/products', productRoutes);
app.use('/services', serviceRoutes);
app.use('/bookings', bookingRoutes);
app.use('/chat', chatRoutes);
app.use('/payments', paymentRoutes);
app.use('/notifications', notificationRoutes);
app.use('/admin', adminRoutes);

// Health check endpoint
app.get('/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'The Real Fintech AI Company Super App API'
  });
});

// Export the main API function
export const api = functions.https.onRequest(app);

// Cloud Functions for background tasks
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // Create user document in Firestore
    await admin.firestore().collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      userType: 'customer', // default user type
      profile: {
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        verified: false
      },
      preferences: {
        notifications: true,
        newsletter: true,
        sms: true
      }
    });

    console.log('User document created for:', user.uid);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  try {
    // Clean up user data
    const batch = admin.firestore().batch();
    
    // Delete user document
    batch.delete(admin.firestore().collection('users').doc(user.uid));
    
    // Delete user's properties
    const properties = await admin.firestore()
      .collection('properties')
      .where('userId', '==', user.uid)
      .get();
    
    properties.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('User data cleaned up for:', user.uid);
  } catch (error) {
    console.error('Error cleaning up user data:', error);
  }
});

// Scheduled functions
export const dailyCleanup = functions.pubsub.schedule('0 2 * * *')
  .timeZone('Asia/Kolkata')
  .onRun(async (context) => {
    console.log('Running daily cleanup...');
    
    // Clean up expired bookings
    const expiredBookings = await admin.firestore()
      .collection('bookings')
      .where('status', '==', 'pending')
      .where('expiresAt', '<=', new Date())
      .get();

    const batch = admin.firestore().batch();
    expiredBookings.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'expired' });
    });

    await batch.commit();
    console.log(`Cleaned up ${expiredBookings.size} expired bookings`);
});

// Real-time triggers
export const onPropertyCreate = functions.firestore
  .document('properties/{propertyId}')
  .onCreate(async (snapshot, context) => {
    const property = snapshot.data();
    const propertyId = context.params.propertyId;

    // Send notification to admin
    await admin.firestore().collection('notifications').add({
      type: 'new_property',
      title: 'New Property Listed',
      message: `A new property has been listed: ${property.title}`,
      recipientType: 'admin',
      data: { propertyId },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
  });

export const onBookingCreate = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snapshot, context) => {
    const booking = snapshot.data();
    const bookingId = context.params.bookingId;

    // Send notification to service provider
    await admin.firestore().collection('notifications').add({
      type: 'new_booking',
      title: 'New Booking Request',
      message: `You have a new booking request for ${booking.serviceType}`,
      recipientId: booking.serviceProviderId,
      data: { bookingId },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });

    // Send confirmation to customer
    await admin.firestore().collection('notifications').add({
      type: 'booking_confirmation',
      title: 'Booking Confirmed',
      message: `Your booking for ${booking.serviceType} has been confirmed`,
      recipientId: booking.customerId,
      data: { bookingId },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    });
  });