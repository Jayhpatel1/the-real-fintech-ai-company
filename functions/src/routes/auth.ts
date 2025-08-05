import { Router } from 'express';
import * as admin from 'firebase-admin';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/profile', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.userId!)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    res.json({
      uid: req.userId,
      ...userData,
      // Don't expose sensitive data
      privateKey: undefined,
      apiKeys: undefined
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { displayName, phone, address, city, state, pincode, userType, preferences } = req.body;
    
    const updateData: any = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    if (displayName) updateData.displayName = displayName;
    if (phone) updateData['profile.phone'] = phone;
    if (address) updateData['profile.address'] = address;
    if (city) updateData['profile.city'] = city;
    if (state) updateData['profile.state'] = state;
    if (pincode) updateData['profile.pincode'] = pincode;
    if (userType) updateData.userType = userType;
    if (preferences) updateData.preferences = preferences;

    await admin.firestore()
      .collection('users')
      .doc(req.userId!)
      .update(updateData);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Delete user account
router.delete('/account', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    // Delete Firebase Auth user
    await admin.auth().deleteUser(req.userId!);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Verify phone number
router.post('/verify-phone', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const { phone, verificationCode } = req.body;
    
    // In a real implementation, you would verify the code with SMS service
    // For now, we'll just mark as verified if code is "123456"
    if (verificationCode === '123456') {
      await admin.firestore()
        .collection('users')
        .doc(req.userId!)
        .update({
          'profile.phone': phone,
          'profile.phoneVerified': true,
          'profile.verified': true,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });

      res.json({ message: 'Phone number verified successfully' });
    } else {
      res.status(400).json({ error: 'Invalid verification code' });
    }
  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({ error: 'Phone verification failed' });
  }
});

// Get user statistics
router.get('/stats', authenticateUser, async (req: AuthenticatedRequest, res) => {
  try {
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(req.userId!)
      .get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const userType = userData?.userType;

    let stats: any = {
      profileCompleteness: calculateProfileCompleteness(userData),
      joinDate: userData?.createdAt,
      lastActivity: userData?.updatedAt
    };

    // Add role-specific stats
    if (userType === 'broker' || userType === 'builder') {
      const propertiesCount = await admin.firestore()
        .collection('properties')
        .where('userId', '==', req.userId)
        .get();
      stats.propertiesListed = propertiesCount.size;
    }

    if (userType === 'service_provider') {
      const servicesCount = await admin.firestore()
        .collection('services')
        .where('userId', '==', req.userId)
        .get();
      stats.servicesOffered = servicesCount.size;
    }

    if (userType === 'shop_owner') {
      const productsCount = await admin.firestore()
        .collection('products')
        .where('userId', '==', req.userId)
        .get();
      stats.productsListed = productsCount.size;
    }

    res.json(stats);
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get user statistics' });
  }
});

function calculateProfileCompleteness(userData: any): number {
  const fields = [
    'displayName',
    'email',
    'profile.phone',
    'profile.address',
    'profile.city',
    'profile.state',
    'profile.pincode'
  ];
  
  let completedFields = 0;
  fields.forEach(field => {
    const fieldValue = getNestedValue(userData, field);
    if (fieldValue && fieldValue.trim() !== '') {
      completedFields++;
    }
  });
  
  return Math.round((completedFields / fields.length) * 100);
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export { router as authRoutes };