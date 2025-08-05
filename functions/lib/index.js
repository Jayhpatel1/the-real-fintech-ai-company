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
exports.onBookingCreate = exports.onPropertyCreate = exports.dailyCleanup = exports.onUserDelete = exports.onUserCreate = exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express = __importStar(require("express"));
const cors = __importStar(require("cors"));
// Initialize Firebase Admin
admin.initializeApp();
const app = express();
app.use(cors({ origin: true }));
// Import route handlers
const auth_1 = require("./routes/auth");
const properties_1 = require("./routes/properties");
const products_1 = require("./routes/products");
const services_1 = require("./routes/services");
const bookings_1 = require("./routes/bookings");
const chat_1 = require("./routes/chat");
const payments_1 = require("./routes/payments");
const notifications_1 = require("./routes/notifications");
const admin_1 = require("./routes/admin");
// Mount routes
app.use('/auth', auth_1.authRoutes);
app.use('/properties', properties_1.propertyRoutes);
app.use('/products', products_1.productRoutes);
app.use('/services', services_1.serviceRoutes);
app.use('/bookings', bookings_1.bookingRoutes);
app.use('/chat', chat_1.chatRoutes);
app.use('/payments', payments_1.paymentRoutes);
app.use('/notifications', notifications_1.notificationRoutes);
app.use('/admin', admin_1.adminRoutes);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'The Real Fintech AI Company Super App API'
    });
});
// Export the main API function
exports.api = functions.https.onRequest(app);
// Cloud Functions for background tasks
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
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
    }
    catch (error) {
        console.error('Error creating user document:', error);
    }
});
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
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
    }
    catch (error) {
        console.error('Error cleaning up user data:', error);
    }
});
// Scheduled functions
exports.dailyCleanup = functions.pubsub.schedule('0 2 * * *')
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
exports.onPropertyCreate = functions.firestore
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
exports.onBookingCreate = functions.firestore
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
//# sourceMappingURL=index.js.map