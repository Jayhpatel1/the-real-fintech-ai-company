import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user notifications
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { read, page = 1, limit = 20 } = req.query;
    
    let query = admin.firestore()
      .collection('notifications')
      .where('recipientId', '==', req.userId!);
    
    if (read !== undefined) {
      query = query.where('read', '==', read === 'true');
    }
    
    query = query.orderBy('createdAt', 'desc').limit(parseInt(limit as string));
    
    const snapshot = await query.get();
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ notifications });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    await admin.firestore()
      .collection('notifications')
      .doc(req.params.id)
      .update({ read: true });
    
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export { router as notificationRoutes };