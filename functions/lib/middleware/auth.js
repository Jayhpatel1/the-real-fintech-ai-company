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
exports.requireUserType = exports.authenticateUser = void 0;
const admin = __importStar(require("firebase-admin"));
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'No authorization token provided' });
            return;
        }
        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        req.userId = decodedToken.uid;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.authenticateUser = authenticateUser;
const requireUserType = (allowedTypes) => {
    return async (req, res, next) => {
        try {
            if (!req.userId) {
                res.status(401).json({ error: 'Authentication required' });
                return;
            }
            const userDoc = await admin.firestore()
                .collection('users')
                .doc(req.userId)
                .get();
            if (!userDoc.exists) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            const userData = userDoc.data();
            const userType = userData === null || userData === void 0 ? void 0 : userData.userType;
            if (!allowedTypes.includes(userType)) {
                res.status(403).json({
                    error: 'Insufficient permissions',
                    required: allowedTypes,
                    current: userType
                });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({ error: 'Authorization check failed' });
        }
    };
};
exports.requireUserType = requireUserType;
//# sourceMappingURL=auth.js.map