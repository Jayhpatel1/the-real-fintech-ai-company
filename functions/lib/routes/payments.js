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
exports.paymentRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.paymentRoutes = router;
// Create payment intent
router.post('/create-intent', auth_1.authenticateUser, async (req, res) => {
    try {
        const { amount, currency = 'INR', paymentMethod, // 'upi', 'card', 'netbanking', 'crypto'
        description, metadata } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }
        const paymentData = {
            userId: req.userId,
            amount: parseFloat(amount),
            currency,
            paymentMethod,
            description,
            metadata: metadata || {},
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };
        let paymentIntent;
        switch (paymentMethod) {
            case 'upi':
                paymentIntent = await createUPIPayment(paymentData);
                break;
            case 'card':
                paymentIntent = await createCardPayment(paymentData);
                break;
            case 'netbanking':
                paymentIntent = await createNetbankingPayment(paymentData);
                break;
            case 'crypto':
                paymentIntent = await createCryptoPayment(paymentData);
                break;
            default:
                return res.status(400).json({ error: 'Unsupported payment method' });
        }
        // Save payment record
        const docRef = await admin.firestore().collection('payments').add({
            ...paymentData,
            paymentIntentId: paymentIntent.id,
            paymentUrl: paymentIntent.paymentUrl
        });
        res.json({
            id: docRef.id,
            paymentIntentId: paymentIntent.id,
            paymentUrl: paymentIntent.paymentUrl,
            amount,
            currency,
            status: 'pending'
        });
    }
    catch (error) {
        console.error('Create payment intent error:', error);
        res.status(500).json({ error: 'Failed to create payment intent' });
    }
});
// Verify payment
router.post('/verify', auth_1.authenticateUser, async (req, res) => {
    try {
        const { paymentId, paymentIntentId, signature } = req.body;
        const paymentDoc = await admin.firestore()
            .collection('payments')
            .doc(paymentId)
            .get();
        if (!paymentDoc.exists) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        const paymentData = paymentDoc.data();
        if ((paymentData === null || paymentData === void 0 ? void 0 : paymentData.userId) !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        // Verify payment based on method
        let isVerified = false;
        let verificationResult;
        switch (paymentData === null || paymentData === void 0 ? void 0 : paymentData.paymentMethod) {
            case 'upi':
                verificationResult = await verifyUPIPayment(paymentIntentId, signature);
                break;
            case 'card':
                verificationResult = await verifyCardPayment(paymentIntentId, signature);
                break;
            case 'netbanking':
                verificationResult = await verifyNetbankingPayment(paymentIntentId, signature);
                break;
            case 'crypto':
                verificationResult = await verifyCryptoPayment(paymentIntentId, signature);
                break;
        }
        isVerified = (verificationResult === null || verificationResult === void 0 ? void 0 : verificationResult.verified) || false;
        // Update payment status
        await paymentDoc.ref.update({
            status: isVerified ? 'completed' : 'failed',
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            verificationData: verificationResult
        });
        if (isVerified) {
            // Create transaction record
            await admin.firestore().collection('transactions').add({
                userId: req.userId,
                paymentId,
                amount: paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount,
                currency: paymentData === null || paymentData === void 0 ? void 0 : paymentData.currency,
                type: 'payment',
                status: 'completed',
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            // Send confirmation notification
            await admin.firestore().collection('notifications').add({
                type: 'payment_success',
                title: 'Payment Successful',
                message: `Your payment of ₹${paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount} has been processed successfully`,
                recipientId: req.userId,
                data: { paymentId, amount: paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount },
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                read: false
            });
        }
        res.json({
            verified: isVerified,
            status: isVerified ? 'completed' : 'failed',
            message: isVerified ? 'Payment verified successfully' : 'Payment verification failed'
        });
    }
    catch (error) {
        console.error('Verify payment error:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});
// Get payment history
router.get('/history', auth_1.authenticateUser, async (req, res) => {
    try {
        const { page = 1, limit = 20, status } = req.query;
        let query = admin.firestore()
            .collection('payments')
            .where('userId', '==', req.userId);
        if (status) {
            query = query.where('status', '==', status);
        }
        query = query.orderBy('createdAt', 'desc');
        const offset = (parseInt(page) - 1) * parseInt(limit);
        query = query.offset(offset).limit(parseInt(limit));
        const snapshot = await query.get();
        const payments = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Don't expose sensitive data
            paymentIntentId: undefined,
            verificationData: undefined
        }));
        res.json({ payments });
    }
    catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({ error: 'Failed to get payment history' });
    }
});
// Get payment methods
router.get('/methods', auth_1.authenticateUser, async (req, res) => {
    try {
        const paymentMethods = [
            {
                id: 'upi',
                name: 'UPI',
                description: 'Pay using any UPI app',
                icon: '📱',
                enabled: true,
                processingFee: 0
            },
            {
                id: 'card',
                name: 'Debit/Credit Card',
                description: 'Pay using your debit or credit card',
                icon: '💳',
                enabled: true,
                processingFee: 2.5 // percentage
            },
            {
                id: 'netbanking',
                name: 'Net Banking',
                description: 'Pay using your bank account',
                icon: '🏦',
                enabled: true,
                processingFee: 1.5
            },
            {
                id: 'crypto',
                name: 'Cryptocurrency',
                description: 'Pay using Dogecoin or other cryptocurrencies',
                icon: '🪙',
                enabled: true,
                processingFee: 1.0,
                supportedCurrencies: ['DOGE', 'BTC', 'ETH']
            }
        ];
        res.json({ paymentMethods });
    }
    catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({ error: 'Failed to get payment methods' });
    }
});
// Refund payment
router.post('/:id/refund', auth_1.authenticateUser, async (req, res) => {
    try {
        const { reason, amount } = req.body;
        const paymentId = req.params.id;
        const paymentDoc = await admin.firestore()
            .collection('payments')
            .doc(paymentId)
            .get();
        if (!paymentDoc.exists) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        const paymentData = paymentDoc.data();
        if ((paymentData === null || paymentData === void 0 ? void 0 : paymentData.userId) !== req.userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        if ((paymentData === null || paymentData === void 0 ? void 0 : paymentData.status) !== 'completed') {
            return res.status(400).json({ error: 'Payment not eligible for refund' });
        }
        const refundAmount = amount || (paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount);
        // Process refund based on payment method
        let refundResult;
        switch (paymentData === null || paymentData === void 0 ? void 0 : paymentData.paymentMethod) {
            case 'upi':
            case 'card':
            case 'netbanking':
                refundResult = await processTraditionalRefund(paymentData.paymentIntentId, refundAmount);
                break;
            case 'crypto':
                refundResult = await processCryptoRefund(paymentData.paymentIntentId, refundAmount);
                break;
        }
        // Create refund record
        const refundRef = await admin.firestore().collection('refunds').add({
            paymentId,
            userId: req.userId,
            originalAmount: paymentData === null || paymentData === void 0 ? void 0 : paymentData.amount,
            refundAmount,
            reason,
            status: (refundResult === null || refundResult === void 0 ? void 0 : refundResult.success) ? 'completed' : 'failed',
            refundId: refundResult === null || refundResult === void 0 ? void 0 : refundResult.refundId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        if (refundResult === null || refundResult === void 0 ? void 0 : refundResult.success) {
            await paymentDoc.ref.update({
                refundStatus: 'completed',
                refundAmount,
                refundedAt: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.json({
            refundId: refundRef.id,
            status: (refundResult === null || refundResult === void 0 ? void 0 : refundResult.success) ? 'completed' : 'failed',
            amount: refundAmount,
            message: (refundResult === null || refundResult === void 0 ? void 0 : refundResult.success) ? 'Refund processed successfully' : 'Refund failed'
        });
    }
    catch (error) {
        console.error('Process refund error:', error);
        res.status(500).json({ error: 'Failed to process refund' });
    }
});
// Helper functions for different payment methods
async function createUPIPayment(paymentData) {
    // Implement UPI payment creation using Razorpay or similar
    return {
        id: `upi_${Date.now()}`,
        paymentUrl: `upi://pay?pa=therealfintech@paytm&pn=TheRealFintech&am=${paymentData.amount}&cu=INR`
    };
}
async function createCardPayment(paymentData) {
    // Implement card payment using Stripe or Razorpay
    return {
        id: `card_${Date.now()}`,
        paymentUrl: `https://checkout.razorpay.com/v1/payment/${Date.now()}`
    };
}
async function createNetbankingPayment(paymentData) {
    return {
        id: `nb_${Date.now()}`,
        paymentUrl: `https://netbanking.payment.gateway/${Date.now()}`
    };
}
async function createCryptoPayment(paymentData) {
    // Implement crypto payment processing
    return {
        id: `crypto_${Date.now()}`,
        paymentUrl: `https://crypto.therealfintech.com/pay/${Date.now()}`,
        walletAddress: 'DM7C4QJxqN8KgZV8iGRnUoKbH5r9WXqJ3t',
        amount: paymentData.amount / 0.08, // Convert INR to DOGE (example rate)
        currency: 'DOGE'
    };
}
async function verifyUPIPayment(paymentIntentId, signature) {
    // Implement UPI payment verification
    return { verified: true, transactionId: paymentIntentId };
}
async function verifyCardPayment(paymentIntentId, signature) {
    // Implement card payment verification
    return { verified: true, transactionId: paymentIntentId };
}
async function verifyNetbankingPayment(paymentIntentId, signature) {
    return { verified: true, transactionId: paymentIntentId };
}
async function verifyCryptoPayment(paymentIntentId, signature) {
    // Implement crypto payment verification
    return { verified: true, transactionId: paymentIntentId, blockHash: signature };
}
async function processTraditionalRefund(paymentIntentId, amount) {
    // Implement traditional payment refund
    return { success: true, refundId: `refund_${Date.now()}` };
}
async function processCryptoRefund(paymentIntentId, amount) {
    // Implement crypto refund
    return { success: true, refundId: `crypto_refund_${Date.now()}` };
}
//# sourceMappingURL=payments.js.map