import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest, requireUserType } from '../middleware/auth';

const router = Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const { type, location, page = 1, limit = 20 } = req.query;
    
    let query = admin.firestore().collection('services');
    
    if (type) query = query.where('serviceType', '==', type);
    if (location) query = query.where('location', '==', location);
    
    const snapshot = await query.limit(parseInt(limit as string)).get();
    const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ services });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// Create service
router.post('/', authenticateUser, requireUserType(['service_provider', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const serviceData = {
      ...req.body,
      userId: req.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      active: true
    };
    
    const docRef = await admin.firestore().collection('services').add(serviceData);
    res.status(201).json({ id: docRef.id, message: 'Service created successfully' });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

export { router as serviceRoutes };