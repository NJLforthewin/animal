"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redisClient_1 = __importDefault(require("../utils/redisClient"));
const secretKey = process.env.JWT_SECRET || 'your_secret_key';
const authenticateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const rawAuthHeader = req.headers['authorization'];
    console.log('[AUTH MIDDLEWARE] Raw Authorization header:', rawAuthHeader);
    const token = rawAuthHeader === null || rawAuthHeader === void 0 ? void 0 : rawAuthHeader.split(' ')[1];
    console.log('[AUTH MIDDLEWARE] Extracted token:', token);
    if (!token) {
        console.warn('[AUTH MIDDLEWARE] No token provided');
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    // Check Redis blacklist
    try {
        const isBlacklisted = yield redisClient_1.default.get(`bl:${token}`);
        if (isBlacklisted) {
            console.warn('[AUTH MIDDLEWARE] Token is blacklisted');
            return res.status(403).json({ message: 'Unauthorized: Token is blacklisted' });
        }
    }
    catch (redisErr) {
        console.error('[AUTH MIDDLEWARE] Redis error:', redisErr);
        return res.status(500).json({ message: 'Internal server error: Redis', error: redisErr });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('[AUTH MIDDLEWARE] JWT verification error:', err);
            return res.status(403).json({ message: 'Unauthorized: Invalid or expired token', error: err });
        }
        req.user = user;
        // Issue a new token with a fresh expiry (sliding expiration)
        const newToken = jsonwebtoken_1.default.sign({ userId: user.userId, email: user.email }, secretKey, { expiresIn: '10m' });
        res.setHeader('X-Refreshed-Token', newToken);
        console.log('[AUTH MIDDLEWARE] JWT verified, user:', user, 'New token issued');
        next();
    });
});
exports.authenticateToken = authenticateToken;
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.sendStatus(403);
        }
        next();
    };
};
exports.checkRole = checkRole;
