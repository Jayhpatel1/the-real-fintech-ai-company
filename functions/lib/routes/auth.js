"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.authRoutes = router;
// Get user profile
router.get('/profile', auth_1.authenticateUser, async (req, res) => {
    try {
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(req.userId)
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
});
// Update user profile
router.put('/profile', auth_1.authenticateUser, async (req, res) => {
    try {
        const { displayName, phone, address, city, state, pincode, userType, preferences } = req.body;
        const updateData = {
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        if (displayName)
            updateData.displayName = displayName;
        if (phone)
            updateData['profile.phone'] = phone;
        if (address)
            updateData['profile.address'] = address;
        if (city)
            updateData['profile.city'] = city;
        if (state)
            updateData['profile.state'] = state;
        if (pincode)
            updateData['profile.pincode'] = pincode;
        if (userType)
            updateData.userType = userType;
        if (preferences)
            updateData.preferences = preferences;
        await admin.firestore()
            .collection('users')
            .doc(req.userId)
            .update(updateData);
        res.json({ message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// Delete user account
router.delete('/account', auth_1.authenticateUser, async (req, res) => {
    try {
        // Delete Firebase Auth user
        await admin.auth().deleteUser(req.userId);
        res.json({ message: 'Account deleted successfully' });
    }
    catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ error: 'Failed to delete account' });
    }
});
// Verify phone number
router.post('/verify-phone', auth_1.authenticateUser, async (req, res) => {
    try {
        const { phone, verificationCode } = req.body;
        // In a real implementation, you would verify the code with SMS service
        // For now, we'll just mark as verified if code is "123456"
        if (verificationCode === '123456') {
            await admin.firestore()
                .collection('users')
                .doc(req.userId)
                .update({
                'profile.phone': phone,
                'profile.phoneVerified': true,
                'profile.verified': true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
            res.json({ message: 'Phone number verified successfully' });
        }
        else {
            res.status(400).json({ error: 'Invalid verification code' });
        }
    }
    catch (error) {
        console.error('Phone verification error:', error);
        res.status(500).json({ error: 'Phone verification failed' });
    }
});
// Get user statistics
router.get('/stats', auth_1.authenticateUser, async (req, res) => {
    try {
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(req.userId)
            .get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userData = userDoc.data();
        const userType = userData === null || userData === void 0 ? void 0 : userData.userType;
        let stats = {
            profileCompleteness: calculateProfileCompleteness(userData),
            joinDate: userData === null || userData === void 0 ? void 0 : userData.createdAt,
            lastActivity: userData === null || userData === void 0 ? void 0 : userData.updatedAt
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
    }
    catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to get user statistics' });
    }
});
function calculateProfileCompleteness(userData) {
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
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current === null || current === void 0 ? void 0 : current[key], obj);
}
//# sourceMappingURL=auth.js.map