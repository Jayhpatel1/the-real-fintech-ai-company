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
exports.notificationRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.notificationRoutes = router;
// Get user notifications
router.get('/', auth_1.authenticateUser, async (req, res) => {
    try {
        const { read, page = 1, limit = 20 } = req.query;
        let query = admin.firestore()
            .collection('notifications')
            .where('recipientId', '==', req.userId);
        if (read !== undefined) {
            query = query.where('read', '==', read === 'true');
        }
        query = query.orderBy('createdAt', 'desc').limit(parseInt(limit));
        const snapshot = await query.get();
        const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ notifications });
    }
    catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// Mark notification as read
router.patch('/:id/read', auth_1.authenticateUser, async (req, res) => {
    try {
        await admin.firestore()
            .collection('notifications')
            .doc(req.params.id)
            .update({ read: true });
        res.json({ message: 'Notification marked as read' });
    }
    catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});
//# sourceMappingURL=notifications.js.map