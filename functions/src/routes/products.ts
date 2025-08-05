import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest, requireUserType } from '../middleware/auth';

const router = Router();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
    
    let query = admin.firestore().collection('products');
    
    if (category) query = query.where('category', '==', category);
    if (search) {
      query = query.where('searchTokens', 'array-contains-any', 
        (search as string).toLowerCase().split(' ').slice(0, 10));
    }
    
    const snapshot = await query.limit(parseInt(limit as string)).get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/', authenticateUser, requireUserType(['shop_owner', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const productData = {
      ...req.body,
      userId: req.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      active: true
    };
    
    const docRef = await admin.firestore().collection('products').add(productData);
    res.status(201).json({ id: docRef.id, message: 'Product created successfully' });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export { router as productRoutes };