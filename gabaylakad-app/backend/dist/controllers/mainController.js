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
exports.sensor = exports.location = exports.history = exports.profile = exports.dashboard = void 0;
const db_1 = require("../utils/db");
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Get all user fields needed for dashboard
        const userResult = yield (0, db_1.query)('SELECT user_id, name, first_name, last_name, email, phone_number, impairment_level, device_id, is_verified, created_at, updated_at FROM user WHERE user_id = ?', [userId]);
        const userRows = Array.isArray(userResult.rows) ? userResult.rows : [];
        const user = userRows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Example: Get recent history (limit 5)
        // If you have a history table, use it. Otherwise, return an empty array.
        let recent = [];
        try {
            const historyResult = yield (0, db_1.query)('SELECT action, date FROM history WHERE user_id = ? ORDER BY date DESC LIMIT 5', [userId]);
            recent = Array.isArray(historyResult.rows) ? historyResult.rows : [];
        }
        catch (err) {
            recent = [];
        }
        res.json({
            message: 'Dashboard data',
            user,
            recent,
            // You can add more fields here if you have them in your DB
            // batteryLevel, location, etc.
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.dashboard = dashboard;
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = yield (0, db_1.query)('SELECT id, fullName AS name, email, phone_number AS phone FROM user WHERE id = ?', [userId]);
        const rows = Array.isArray(result.rows) ? result.rows : [];
        const user = rows[0];
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile data', user });
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.profile = profile;
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
