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
exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.register = exports.handleRefreshToken = exports.login = exports.logout = exports.changePassword = void 0;
// Change password endpoint (for logged-in users)
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { currentPassword, newPassword } = req.body;
    console.log('[changePassword] userId:', userId);
    console.log('[changePassword] req.body:', req.body);
    if (!userId || !currentPassword || !newPassword) {
        console.warn('[changePassword] Missing required fields:', { userId, currentPassword, newPassword });
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE user_id = ?', [userId]);
        const rows = Array.isArray(result.rows) ? result.rows : [];
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield (0, db_1.query)('UPDATE user SET password = ? WHERE user_id = ?', [hashedPassword, userId]);
        return res.status(200).json({ message: 'Password changed successfully!' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error', error });
    }
});
exports.changePassword = changePassword;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../utils/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
// ...existing code...
const redisHelpers_1 = require("../utils/redisHelpers");
// Helper to hash refresh tokens for Redis keying
function hashRefreshToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
// Logout endpoint
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract token from Authorization header
    const rawAuthHeader = req.headers['authorization'];
    const token = rawAuthHeader === null || rawAuthHeader === void 0 ? void 0 : rawAuthHeader.split(' ')[1];
    const { refreshToken } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'No token provided for logout.' });
    }
    try {
        yield (0, redisHelpers_1.blacklistToken)(token, process.env.JWT_SECRET || 'your_secret_key');
        // Blacklist refresh token in Redis
        if (refreshToken) {
            const hashedRefresh = hashRefreshToken(refreshToken);
            yield (0, redisHelpers_1.setSession)(`refresh:${hashedRefresh}`, '', 1); // expire immediately
        }
        return res.status(200).json({ message: 'Logout successful! Token and refresh token blacklisted.' });
    }
    catch (err) {
        console.error('[LOGOUT] Error blacklisting token:', err);
        return res.status(500).json({ message: 'Logout failed. Could not blacklist token.', error: err });
    }
});
exports.logout = logout;
// Helper to generate refresh token
function generateRefreshToken() {
    return crypto_1.default.randomBytes(32).toString('hex');
}
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    console.log('[LOGIN] Request received:', { email });
    if (!email || !password) {
        const msg = '[LOGIN] Missing email or password';
        console.warn(msg);
        res.setHeader('X-Login-Error', msg);
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    try {
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE email = ?', [email]);
        const rows = Array.isArray(result.rows) ? result.rows : [];
        console.log('[LOGIN] DB user lookup result:', rows);
        const user = rows[0];
        if (!user) {
            const msg = '[LOGIN] User not found for email: ' + email;
            console.warn(msg);
            res.setHeader('X-Login-Error', msg);
            return res.status(404).json({ message: 'User not found!' });
        }
        if (!user.is_verified) {
            const msg = '[LOGIN] User not verified: ' + email;
            console.warn(msg);
            res.setHeader('X-Login-Error', msg);
            return res.status(401).json({ message: 'Please verify your email before logging in.', token: null });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        console.log('[LOGIN] Password valid:', isPasswordValid);
        if (!isPasswordValid) {
            const msg = '[LOGIN] Incorrect password for email: ' + email;
            console.warn(msg);
            res.setHeader('X-Login-Error', msg);
            return res.status(401).json({ message: 'Incorrect password!', token: null });
        }
        console.log(`[LOGIN SUCCESS] User ${user.user_id} (${user.email}) logged in at ${new Date().toISOString()}`);
        const token = jsonwebtoken_1.default.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '10m' });
        const refreshToken = generateRefreshToken();
        // Save refresh token in DB
        yield (0, db_1.query)('UPDATE user SET refresh_token = ? WHERE user_id = ?', [refreshToken, user.user_id]);
        // Store hashed refresh token in Redis with TTL (30 days)
        const hashedRefresh = hashRefreshToken(refreshToken);
        yield (0, redisHelpers_1.setSession)(`refresh:${hashedRefresh}`, String(user.user_id), 30 * 24 * 60 * 60); // 30 days
        console.log('[LOGIN] JWT token generated:', token);
        console.log('[LOGIN] Refresh token generated:', refreshToken);
        res.setHeader('X-Login-Info', '[LOGIN] JWT token generated');
        return res.status(200).json({ message: 'Login successful!', token, refreshToken });
    }
    catch (error) {
        console.error('[LOGIN] Error:', error);
        return res.status(500).json({ message: 'Database error occurred', error });
    }
});
exports.login = login;
// Endpoint to refresh access token
const handleRefreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: 'Missing refresh token' });
    }
    try {
        const hashedRefresh = hashRefreshToken(refreshToken);
        // Check Redis for valid refresh token
        const userId = yield (0, redisHelpers_1.getSession)(`refresh:${hashedRefresh}`);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }
        // Optionally, check DB for user existence
        const { rows } = yield (0, db_1.query)('SELECT * FROM user WHERE user_id = ?', [userId]);
        const user = Array.isArray(rows) ? rows[0] : undefined;
        if (!user) {
            return res.status(401).json({ message: 'User not found for refresh token' });
        }
        // Rotate refresh token: generate new, update DB, update Redis
        const newRefreshToken = generateRefreshToken();
        yield (0, db_1.query)('UPDATE user SET refresh_token = ? WHERE user_id = ?', [newRefreshToken, user.user_id]);
        const newHashedRefresh = hashRefreshToken(newRefreshToken);
        yield (0, redisHelpers_1.setSession)(`refresh:${newHashedRefresh}`, String(user.user_id), 30 * 24 * 60 * 60); // 30 days
        // Blacklist old refresh token in Redis (delete session)
        yield (0, redisHelpers_1.setSession)(`refresh:${hashedRefresh}`, '', 1); // expire immediately
        // Issue new access token
        const token = jsonwebtoken_1.default.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '10m' });
        return res.status(200).json({ token, refreshToken: newRefreshToken });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error occurred', error });
    }
});
exports.handleRefreshToken = handleRefreshToken;
// Register endpoint
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, fullName, email, phone_number, impairment_level, password, relationship, blind_full_name, blind_age, blind_phone_number, serial_number } = req.body;
    const name = `${firstName} ${lastName}`.trim();
    if (!firstName || !lastName || !email || !phone_number || !impairment_level || !password || !blind_full_name || !blind_age || !serial_number) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }
    try {
        // Check if device with this serial number exists
        const deviceRes = yield (0, db_1.query)('SELECT device_id FROM device WHERE serial_number = ?', [serial_number]);
        const deviceRows = Array.isArray(deviceRes.rows) ? deviceRes.rows : [];
        let device_id;
        if (deviceRows.length > 0) {
            // Device exists, check if assigned to a user
            const deviceId = deviceRows[0].device_id;
            const userRes = yield (0, db_1.query)('SELECT user_id FROM user WHERE device_id = ?', [deviceId]);
            const userRows = Array.isArray(userRes.rows) ? userRes.rows : [];
            if (userRows.length > 0) {
                // Device is already assigned
                return res.status(409).json({ message: 'Device serial number is already assigned to another user. Please use a different device.' });
            }
            device_id = deviceId;
        }
        else {
            // Device does not exist, create it
            const deviceResult = yield (0, db_1.query)('INSERT INTO device (serial_number, is_active) VALUES (?, ?)', [serial_number, 1]);
            device_id = deviceResult.insertId;
        }
        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        yield (0, db_1.query)('INSERT INTO user (name, first_name, last_name, email, phone_number, impairment_level, device_id, password, is_verified, verification_code, relationship, blind_full_name, blind_age, blind_phone_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [
            name !== null && name !== void 0 ? name : null,
            firstName !== null && firstName !== void 0 ? firstName : null,
            lastName !== null && lastName !== void 0 ? lastName : null,
            email !== null && email !== void 0 ? email : null,
            phone_number !== null && phone_number !== void 0 ? phone_number : null,
            impairment_level !== null && impairment_level !== void 0 ? impairment_level : null,
            device_id !== null && device_id !== void 0 ? device_id : null,
            hashedPassword !== null && hashedPassword !== void 0 ? hashedPassword : null,
            false,
            verificationCode !== null && verificationCode !== void 0 ? verificationCode : null,
            relationship !== null && relationship !== void 0 ? relationship : null,
            blind_full_name !== null && blind_full_name !== void 0 ? blind_full_name : null,
            blind_age !== null && blind_age !== void 0 ? blind_age : null,
            blind_phone_number !== null && blind_phone_number !== void 0 ? blind_phone_number : null
        ]);
        const previewUrl = yield (0, email_1.sendResetEmail)(email, verificationCode);
        return res.status(201).json({ message: 'Registration initiated. Please check your email for the verification code.', serial_number, device_id, previewUrl });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Database error occurred', error });
    }
});
exports.register = register;
// ...existing code for verifyEmail, forgotPassword, resetPassword...
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.status(400).json({ message: 'Missing email or code' });
    }
    try {
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE email = ?', [email]);
        const rows = Array.isArray(result.rows) ? result.rows : [];
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        if (user.is_verified) {
            return res.status(400).json({ message: 'User already verified' });
        }
        if (user.verification_code !== code) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        yield (0, db_1.query)('UPDATE user SET is_verified = ?, verification_code = NULL WHERE email = ?', [true, email]);
        return res.status(200).json({ message: 'Email verified successfully!' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error occurred', error });
    }
});
exports.verifyEmail = verifyEmail;
// Helper to hash tokens
function hashToken(token) {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
}
// Forgot password endpoint (request reset)
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const { email } = req.body;
    if (!email || typeof email !== 'string' || email.trim() === '') {
        console.error('Forgot password error: Missing or invalid email');
        return res.status(400).json({ message: 'If your email exists, you will receive a reset link.' });
    }
    try {
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE email = ?', [email.trim()]);
        const rows = Array.isArray(result.rows) ? result.rows : [];
        const user = rows[0];
        if (!user) {
            console.warn(`Forgot password: No user found for email ${email}`);
            return res.status(200).json({ message: 'If your email exists, you will receive a reset link.' });
        }
        // Generate a secure random token
        const rawToken = crypto_1.default.randomBytes(32).toString('hex');
        const hashedToken = (_b = hashToken(rawToken)) !== null && _b !== void 0 ? _b : null;
        const expires = (_c = new Date(Date.now() + 15 * 60 * 1000)) !== null && _c !== void 0 ? _c : null; // 15 min
        const userId = (_d = user.user_id) !== null && _d !== void 0 ? _d : null;
        // Defensive check for undefined values
        if (hashedToken === undefined || expires === undefined || userId === undefined) {
            console.error('Forgot password: One or more parameters for DB update are undefined', {
                hashedToken, expires, userId
            });
            return res.status(500).json({ message: 'Internal error: missing parameters for password reset.' });
        }
        // Store hashed token and expiry in DB
        yield (0, db_1.query)('UPDATE user SET reset_token = ?, reset_token_expires = ? WHERE user_id = ?', [hashedToken, expires, userId]);
        // Send raw token via email
        const previewUrl = yield (0, email_1.sendResetEmail)(email, rawToken, 'reset');
        return res.status(200).json({ message: 'If your email exists, you will receive a reset link.', previewUrl });
    }
    catch (error) {
        console.error('Forgot password DB error:', error);
        return res.status(500).json({ message: 'Database error occurred', error });
    }
});
exports.forgotPassword = forgotPassword;
// Reset password endpoint
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
        return res.status(400).json({ message: 'Missing token or new password' });
    }
    try {
        const hashedToken = hashToken(resetToken);
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE reset_token = ?', [hashedToken]);
        const rows = Array.isArray(result.rows) ? result.rows : [];
        const user = rows[0];
        if (!user || !user.reset_token_expires || new Date(user.reset_token_expires) < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield (0, db_1.query)('UPDATE user SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE user_id = ?', [hashedPassword, user.user_id]);
        return res.status(200).json({ message: 'Password reset successful!' });
    }
    catch (error) {
        return res.status(400).json({ message: 'Invalid or expired token', error });
    }
});
exports.resetPassword = resetPassword;
