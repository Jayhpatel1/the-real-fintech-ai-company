import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest, requireUserType } from '../middleware/auth';

const router = Router();

// Get all properties with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      type, // apartment, villa, commercial
      city,
      state,
      minPrice,
      maxPrice,
      bedrooms,
      status, // sale, rent, sold, rented
      userId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = admin.firestore().collection('properties');

    // Apply filters
    if (type) query = query.where('type', '==', type);
    if (city) query = query.where('city', '==', city);
    if (state) query = query.where('state', '==', state);
    if (status) query = query.where('status', '==', status);
    if (userId) query = query.where('userId', '==', userId);
    if (bedrooms) query = query.where('bedrooms', '==', parseInt(bedrooms as string));

    // Price range filter (requires composite index)
    if (minPrice && maxPrice) {
      query = query.where('price', '>=', parseInt(minPrice as string))
                   .where('price', '<=', parseInt(maxPrice as string));
    } else if (minPrice) {
      query = query.where('price', '>=', parseInt(minPrice as string));
    } else if (maxPrice) {
      query = query.where('price', '<=', parseInt(maxPrice as string));
    }

    // Add ordering
    query = query.orderBy(sortBy as string, sortOrder as 'asc' | 'desc');

    // Pagination
    const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
    query = query.offset(offset).limit(parseInt(limit as string));

    const snapshot = await query.get();
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get total count for pagination
    const totalQuery = admin.firestore().collection('properties');
    const totalSnapshot = await totalQuery.get();
    const totalCount = totalSnapshot.size;

    res.json({
      properties,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: totalCount,
        pages: Math.ceil(totalCount / parseInt(limit as string))
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
router.get('/:id', async (req, res) => {
  try {
    const propertyDoc = await admin.firestore()
      .collection('properties')
      .doc(req.params.id)
      .get();

    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const property = { id: propertyDoc.id, ...propertyDoc.data() };

    // Increment view count
    await propertyDoc.ref.update({
      views: admin.firestore.FieldValue.increment(1),
      lastViewed: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create new property
router.post('/', authenticateUser, requireUserType(['broker', 'builder', 'customer', 'admin']), async (req: AuthenticatedRequest, res) => {
  try {
    const {
      title,
      description,
      type,
      status,
      price,
      address,
      city,
      state,
      pincode,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      features,
      coordinates
    } = req.body;

    const propertyData = {
      title,
      description,
      type,
      status,
      price: parseFloat(price),
      address,
      city,
      state,
      pincode,
      bedrooms: parseInt(bedrooms) || 0,
      bathrooms: parseInt(bathrooms) || 0,
      area: parseFloat(area) || 0,
      amenities: amenities || [],
      images: images || [],
      features: features || {},
      coordinates: coordinates || null,
      userId: req.userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      views: 0,
      favorites: 0,
      verified: false,
      active: true
    };

    const docRef = await admin.firestore().collection('properties').add(propertyData);
    
    res.status(201).json({
      id: docRef.id,
      message: 'Property created successfully'
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
router.put('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const propertyRef = admin.firestore().collection('properties').doc(req.params.id);
    const propertyDoc = await propertyRef.get();

    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const propertyData = propertyDoc.data();
    
    // Check if user owns the property or is admin
    const userDoc = await admin.firestore().collection('users').doc(req.userId!).get();
    const userType = userDoc.data()?.userType;
    
    if (propertyData?.userId !== req.userId && userType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this property' });
    }

    const updateData = {
      ...req.body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // Remove system fields that shouldn't be updated directly
    delete updateData.userId;
    delete updateData.createdAt;
    delete updateData.views;
    delete updateData.favorites;

    await propertyRef.update(updateData);
    
    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
router.delete('/:id', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const propertyRef = admin.firestore().collection('properties').doc(req.params.id);
    const propertyDoc = await propertyRef.get();

    if (!propertyDoc.exists) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const propertyData = propertyDoc.data();
    
    // Check if user owns the property or is admin
    const userDoc = await admin.firestore().collection('users').doc(req.userId!).get();
    const userType = userDoc.data()?.userType;
    
    if (propertyData?.userId !== req.userId && userType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this property' });
    }

    await propertyRef.delete();
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// Add to favorites
router.post('/:id/favorite', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.userId!;

    // Check if already favorited
    const favoriteDoc = await admin.firestore()
      .collection('favorites')
      .where('userId', '==', userId)
      .where('propertyId', '==', propertyId)
      .get();

    if (!favoriteDoc.empty) {
      return res.status(400).json({ error: 'Property already in favorites' });
    }

    // Add to favorites
    await admin.firestore().collection('favorites').add({
      userId,
      propertyId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Increment favorites count
    await admin.firestore().collection('properties').doc(propertyId).update({
      favorites: admin.firestore.FieldValue.increment(1)
    });

    res.json({ message: 'Property added to favorites' });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Failed to add to favorites' });
  }
});

// Remove from favorites
router.delete('/:id/favorite', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const propertyId = req.params.id;
    const userId = req.userId!;

    const favoriteQuery = await admin.firestore()
      .collection('favorites')
      .where('userId', '==', userId)
      .where('propertyId', '==', propertyId)
      .get();

    if (favoriteQuery.empty) {
      return res.status(404).json({ error: 'Property not in favorites' });
    }

    // Remove from favorites
    await favoriteQuery.docs[0].ref.delete();

    // Decrement favorites count
    await admin.firestore().collection('properties').doc(propertyId).update({
      favorites: admin.firestore.FieldValue.increment(-1)
    });

    res.json({ message: 'Property removed from favorites' });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ error: 'Failed to remove from favorites' });
  }
});

// Get user's favorites
router.get('/user/favorites', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const favoritesQuery = await admin.firestore()
      .collection('favorites')
      .where('userId', '==', req.userId!)
      .get();

    const propertyIds = favoritesQuery.docs.map(doc => doc.data().propertyId);
    
    if (propertyIds.length === 0) {
      return res.json({ favorites: [] });
    }

    // Get property details
    const properties = await Promise.all(
      propertyIds.map(async (id) => {
        const propertyDoc = await admin.firestore().collection('properties').doc(id).get();
        return propertyDoc.exists ? { id: propertyDoc.id, ...propertyDoc.data() } : null;
      })
    );

    const validProperties = properties.filter(property => property !== null);

    res.json({ favorites: validProperties });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to get favorites' });
  }
});

// Search properties with advanced filters
router.post('/search', async (req, res) => {
  try {
    const {
      query: searchQuery,
      filters,
      location,
      radius = 10,
      page = 1,
      limit = 20
    } = req.body;

    let query = admin.firestore().collection('properties');

    // Apply text search on title and description
    if (searchQuery) {
      // Note: Firestore doesn't have full-text search, so this is a basic implementation
      // In production, you'd use Algolia or Elasticsearch
      query = query.where('searchTokens', 'array-contains-any', 
        searchQuery.toLowerCase().split(' ').slice(0, 10));
    }

    // Apply additional filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          query = query.where(key, '==', value);
        }
      });
    }

    // Location-based search would require additional geohashing
    // This is a simplified implementation
    if (location && location.city) {
      query = query.where('city', '==', location.city);
    }

    const snapshot = await query.limit(parseInt(limit as string)).get();
    const properties = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ properties, total: properties.length });
  } catch (error) {
    console.error('Search properties error:', error);
    res.status(500).json({ error: 'Failed to search properties' });
  }
});

export { router as propertyRoutes };