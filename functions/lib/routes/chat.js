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
exports.chatRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.chatRoutes = router;
// Get user's chats
router.get('/', auth_1.authenticateUser, async (req, res) => {
    try {
        const chatsQuery = await admin.firestore()
            .collection('chats')
            .where(`participants.${req.userId}`, '!=', null)
            .orderBy('lastMessageAt', 'desc')
            .get();
        const chats = chatsQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ chats });
    }
    catch (error) {
        console.error('Get chats error:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});
// Send message
router.post('/:chatId/messages', auth_1.authenticateUser, async (req, res) => {
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
    }
    catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});
//# sourceMappingURL=chat.js.map