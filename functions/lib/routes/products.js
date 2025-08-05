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
exports.productRoutes = void 0;
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.productRoutes = router;
// Get all products with filtering
router.get('/', async (req, res) => {
    try {
        const { category, minPrice, maxPrice, search, page = 1, limit = 20 } = req.query;
        let query = admin.firestore().collection('products');
        if (category)
            query = query.where('category', '==', category);
        if (search) {
            query = query.where('searchTokens', 'array-contains-any', search.toLowerCase().split(' ').slice(0, 10));
        }
        const snapshot = await query.limit(parseInt(limit)).get();
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ products });
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// Create product
router.post('/', auth_1.authenticateUser, (0, auth_1.requireUserType)(['shop_owner', 'admin']), async (req, res) => {
    try {
        const productData = {
            ...req.body,
            userId: req.userId,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            active: true
        };
        const docRef = await admin.firestore().collection('products').add(productData);
        res.status(201).json({ id: docRef.id, message: 'Product created successfully' });
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});
//# sourceMappingURL=products.js.map