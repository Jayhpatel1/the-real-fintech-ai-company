import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest, requireUserType } from '../middleware/auth';

const router = Router();

// Get platform statistics
router.get('/stats', authenticateUser, requireUserType(['admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const [users, properties, bookings, payments] = await Promise.all([
      admin.firestore().collection('users').get(),
      admin.firestore().collection('properties').get(),
      admin.firestore().collection('bookings').get(),
      admin.firestore().collection('payments').get()
    ]);
    
    const stats = {
      totalUsers: users.size,
      totalProperties: properties.size,
      totalBookings: bookings.size,
      totalPayments: payments.size,
      timestamp: new Date().toISOString()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

export { router as adminRoutes };