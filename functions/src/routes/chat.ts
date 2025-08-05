import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user's chats
router.get('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const chatsQuery = await admin.firestore()
      .collection('chats')
      .where(`participants.${req.userId}`, '!=', null)
      .orderBy('lastMessageAt', 'desc')
      .get();
    
    const chats = chatsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ chats });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Send message
router.post('/:chatId/messages', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { message, type = 'text' } = req.body;
    const chatId = req.params.chatId;
    
    const messageData = {
      senderId: req.userId,
      message,
      type,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      read: false
    };
    
    await admin.firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(messageData);
    
    // Update chat last message
    await admin.firestore()
      .collection('chats')
      .doc(chatId)
      .update({
        lastMessage: message,
        lastMessageAt: admin.firestore.FieldValue.serverTimestamp()
      });
    
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export { router as chatRoutes };