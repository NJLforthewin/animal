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
exports.getCache = exports.setCache = exports.getSession = exports.setSession = exports.blacklistToken = void 0;
const redisClient_1 = __importDefault(require("./redisClient"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function blacklistToken(token, secretKey) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Decode token to get expiry
            const decoded = jsonwebtoken_1.default.decode(token);
            if (!decoded || !decoded.exp)
                throw new Error('Invalid token');
            const expirySeconds = decoded.exp - Math.floor(Date.now() / 1000);
            if (expirySeconds > 0) {
                yield redisClient_1.default.set(`bl:${token}`, '1', { EX: expirySeconds });
            }
        }
        catch (err) {
            console.error('[REDIS BLACKLIST] Error blacklisting token:', err);
        }
    });
}
exports.blacklistToken = blacklistToken;
// Example: Using Redis for session storage
function setSession(key, value, ttlSeconds) {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisClient_1.default.set(`sess:${key}`, value, { EX: ttlSeconds });
    });
}
exports.setSession = setSession;
function getSession(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield redisClient_1.default.get(`sess:${key}`);
    });
}
exports.getSession = getSession;
// Example: Using Redis for caching
function setCache(key, value, ttlSeconds) {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisClient_1.default.set(`cache:${key}`, value, { EX: ttlSeconds });
    });
}
exports.setCache = setCache;
function getCache(key) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield redisClient_1.default.get(`cache:${key}`);
    });
}
exports.getCache = getCache;
