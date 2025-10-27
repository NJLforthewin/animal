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
exports.getSensorData = void 0;
const getSensorData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log(`[SENSOR] getSensorData called by user: ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.userId}`);
    try {
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        // Look up device for authenticated user
        const pool = require('../../db/db').default;
        const [userRows] = yield pool.query('SELECT device_id FROM user WHERE user_id = ?', [userId]);
        if (!userRows || userRows.length === 0 || !userRows[0].device_id) {
            return res.status(404).json({ message: 'No device found for user' });
        }
        const deviceId = userRows[0].device_id;
        // Fetch sensor data for device (mocked for now)
        const sensorData = {
            device_id: deviceId,
            heart_rate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            oxygen_level: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
            timestamp: new Date().toISOString(),
        };
        res.json(sensorData);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching sensor data', error });
    }
});
exports.getSensorData = getSensorData;
