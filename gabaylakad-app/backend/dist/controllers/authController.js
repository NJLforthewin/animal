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
exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.register = exports.login = exports.logout = void 0;
// Logout endpoint
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // If using JWT, logout is handled client-side by deleting the token.
    // Optionally, you can implement token blacklisting here.
    return res.status(200).json({ message: 'Logout successful!' });
});
exports.logout = logout;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../utils/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_1 = require("../utils/email");
const crypto_1 = __importDefault(require("crypto"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    try {
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE email = ?', [email]);
        const rows = Array.isArray(result.rows) ? result.rows : [];
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        if (!user.is_verified) {
            return res.status(401).json({ message: 'Please verify your email before logging in.' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password!' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });
        return res.status(200).json({ message: 'Login successful!', token });
    }
    catch (error) {
        return res.status(500).json({ message: 'Database error occurred', error });
    }
});
exports.login = login;
// Register endpoint
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, password, email, phone_number, impairment_level, device_id } = req.body;
    if (!fullName || !password || !email || !phone_number || !impairment_level || !device_id) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }
    const nameParts = fullName.trim().split(' ', 2);
    const firstName = nameParts[0];
    const lastName = nameParts[1] || '';
    try {
        // Check if user already exists by email
        const existing = yield (0, db_1.query)('SELECT * FROM user WHERE email = ?', [email]);
        const existingRows = Array.isArray(existing.rows) ? existing.rows : [];
        if (existingRows.length > 0) {
            return res.status(409).json({ message: 'User already exists!' });
        }
        // Check device existence and activation status
        const deviceRes = yield (0, db_1.query)('SELECT * FROM device WHERE serial_number = ?', [device_id]);
        const deviceRows = Array.isArray(deviceRes.rows) ? deviceRes.rows : [];
        if (deviceRows.length === 0) {
            return res.status(404).json({ message: 'Device ID not found. Please check your device manual for the correct Device ID.' });
        }
        const device = deviceRows[0];
        // MySQL BIT(1) returns Buffer, so check for 1 or true
        const isActive = device.is_active === 1 || device.is_active === true || (Buffer.isBuffer(device.is_active) && device.is_active[0] === 1);
        if (!isActive) {
            return res.status(403).json({ message: 'Device is not yet activated. Please contact customer service for activation.' });
        }
        // Check if device is already registered to a user
        const deviceUserRes = yield (0, db_1.query)('SELECT * FROM user WHERE device_id = ?', [device_id]);
        const deviceUserRows = Array.isArray(deviceUserRes.rows) ? deviceUserRes.rows : [];
        if (deviceUserRows.length > 0) {
            return res.status(409).json({ message: 'The Device ID you entered already exists. Please check your device manual for the correct Device ID or use a different one.' });
        }
        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const name = `${firstName} ${lastName}`.trim();
        yield (0, db_1.query)('INSERT INTO user (name, first_name, last_name, email, phone_number, impairment_level, device_id, password, is_verified, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [name, firstName, lastName, email, phone_number, impairment_level, device_id, hashedPassword, false, verificationCode]);
        const previewUrl = yield (0, email_1.sendResetEmail)(email, verificationCode);
        return res.status(201).json({ message: 'Registration initiated. Please check your email for the verification code.', previewUrl });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Database error occurred', error });
    }
});
exports.register = register;
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
    var _a, _b, _c;
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
        const hashedToken = (_a = hashToken(rawToken)) !== null && _a !== void 0 ? _a : null;
        const expires = (_b = new Date(Date.now() + 15 * 60 * 1000)) !== null && _b !== void 0 ? _b : null; // 15 min
        const userId = (_c = user.user_id) !== null && _c !== void 0 ? _c : null;
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
