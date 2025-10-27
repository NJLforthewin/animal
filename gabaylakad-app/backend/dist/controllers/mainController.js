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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sensor = exports.location = exports.history = exports.getUserProfile = exports.dashboard = exports.updateProfile = void 0;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(`[MAIN] updateProfile called by user: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.userId}`);
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        let { first_name, last_name, phone_number, email, relationship, blind_full_name, blind_phone_number, blind_age, impairment_level, serial_number, avatar } = req.body;
        let device_id = null;
        if (serial_number) {
            const deviceRes = yield (0, db_1.query)('SELECT device_id FROM device WHERE serial_number = ?', [serial_number]);
            const deviceRows = Array.isArray(deviceRes.rows) ? deviceRes.rows : [];
            if (deviceRows.length > 0) {
                device_id = deviceRows[0].device_id;
            }
        }
        // Fix device_id: convert empty string to null
        if (device_id === "")
            device_id = null;
        console.log('[BACKEND] Received avatar in updateProfile:', avatar);
        // Validate required fields
        if (!first_name || !last_name || !phone_number || !email) {
            return res.status(400).json({
                message: 'Missing required fields',
                missing: [
                    !first_name ? 'first_name' : null,
                    !last_name ? 'last_name' : null,
                    !phone_number ? 'phone_number' : null,
                    !email ? 'email' : null
                ].filter(Boolean)
            });
        }
        // Update user profile fields including avatar
        yield (0, db_1.query)(`UPDATE user SET first_name = ?, last_name = ?, phone_number = ?, email = ?, relationship = ?, blind_full_name = ?, blind_phone_number = ?, blind_age = ?, impairment_level = ?, device_id = ?, avatar = ? WHERE user_id = ?`, [first_name, last_name, phone_number, email, relationship, blind_full_name, blind_phone_number, blind_age, impairment_level, device_id, avatar, userId]);
        // Return updated profile
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE user_id = ?', [userId]);
        const user = Array.isArray(result.rows) ? result.rows[0] : null;
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.updateProfile = updateProfile;
const db_1 = require("../utils/db");
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    console.log(`[MAIN] dashboard called by user: ${(_c = req.user) === null || _c === void 0 ? void 0 : _c.userId}`);
    try {
        const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId;
        console.log('[DASHBOARD] Incoming request. Decoded userId:', userId);
        if (!userId) {
            console.error('[DASHBOARD] Unauthorized: No userId in token. Raw req.user:', req.user);
            res.setHeader('X-Login-Error', '[DASHBOARD] Unauthorized: No userId in token');
            return res.status(401).json({ message: 'Unauthorized', details: 'No userId in token', rawUser: req.user });
        }
        // Get all user fields needed for dashboard
        let userResult;
        try {
            userResult = yield (0, db_1.query)('SELECT user_id, name, first_name, last_name, email, phone_number, impairment_level, device_id, is_verified, created_at, updated_at, relationship, blind_full_name, blind_age, blind_phone_number, avatar FROM user WHERE user_id = ?', [userId]);
        }
        catch (dbErr) {
            console.error('[DASHBOARD] DB error on user lookup:', dbErr);
            res.setHeader('X-Login-Error', '[DASHBOARD] DB error on user lookup');
            return res.status(500).json({ message: 'Database error', error: dbErr });
        }
        const userRows = Array.isArray(userResult.rows) ? userResult.rows : [];
        const user = userRows[0];
        if (!user) {
            console.error('[DASHBOARD] User not found for userId:', userId);
            res.setHeader('X-Login-Error', '[DASHBOARD] User not found');
            return res.status(404).json({ message: 'User not found', userId });
        }
        // Look up device serial number if device_id exists
        let device_serial_number = null;
        if (user && user.device_id) {
            try {
                const deviceRes = yield (0, db_1.query)('SELECT serial_number FROM device WHERE device_id = ?', [user.device_id]);
                const deviceRows = Array.isArray(deviceRes.rows) ? deviceRes.rows : [];
                if (deviceRows.length > 0) {
                    device_serial_number = deviceRows[0].serial_number;
                }
            }
            catch (err) {
                console.error('[DASHBOARD] Error fetching device serial number:', err);
            }
        }
        user.device_serial_number = device_serial_number;
        // Example: Get recent history (limit 5)
        let recent = [];
        try {
            const historyResult = yield (0, db_1.query)('SELECT action, date FROM history WHERE user_id = ? ORDER BY date DESC LIMIT 5', [userId]);
            // Ensure result is always an array of {action, date}
            if (Array.isArray(historyResult.rows)) {
                recent = historyResult.rows.map((row) => {
                    var _a, _b;
                    return ({
                        action: (_a = row.action) !== null && _a !== void 0 ? _a : '',
                        date: (_b = row.date) !== null && _b !== void 0 ? _b : ''
                    });
                });
            }
            else {
                recent = [];
            }
        }
        catch (err) {
            console.warn('[DASHBOARD] History DB error:', err);
            recent = [];
        }
        console.log('[DASHBOARD] Success. Returning dashboard data for userId:', userId);
        res.setHeader('X-Login-Info', '[DASHBOARD] Success');
        res.json({
            message: 'Dashboard data',
            user,
            recent,
            // You can add more fields here if you have them in your DB
            // batteryLevel, location, etc.
        });
    }
    catch (error) {
        console.error('[DASHBOARD] Unexpected error:', error);
        res.setHeader('X-Login-Error', '[DASHBOARD] Unexpected error');
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.dashboard = dashboard;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const result = yield (0, db_1.query)('SELECT * FROM user WHERE user_id = ?', [userId]);
        const userRows = Array.isArray(result.rows) ? result.rows : [];
        const user = userRows[0] || null;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Always attach device serial number from device table
        let serial_number = null;
        if (user && user.device_id) {
            const deviceRes = yield (0, db_1.query)('SELECT serial_number FROM device WHERE device_id = ?', [user.device_id]);
            const deviceRows = Array.isArray(deviceRes.rows) ? deviceRes.rows : [];
            serial_number = ((_f = deviceRows[0]) === null || _f === void 0 ? void 0 : _f.serial_number) || null;
        }
        res.json(Object.assign(Object.assign({}, user), { serial_number }));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getUserProfile = getUserProfile;
const history = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Mock history data
    res.json({
        message: 'History data',
        records: [
            { date: '2025-09-25', action: 'Login' },
            { date: '2025-09-26', action: 'Sensor check' }
        ]
    });
});
exports.history = history;
const location = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Mock location data
    res.json({
        message: 'Location data',
        locations: [
            { lat: 14.5995, lng: 120.9842, timestamp: '2025-09-27T10:00:00Z' }
        ]
    });
});
exports.location = location;
const sensor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Mock sensor data
    res.json({
        message: 'Sensor data',
        sensors: [
            { type: 'Temperature', value: 36.5, unit: 'C', timestamp: '2025-09-27T10:05:00Z' }
        ]
    });
});
exports.sensor = sensor;
