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
exports.getActivitySummary = exports.getReflectorStatus = exports.getRecentAlerts = exports.getBatteryLevels = exports.getDashboardData = exports.getDeviceInfo = exports.getLocationData = exports.getActivityLog = exports.getNightReflectorStatus = exports.getEmergencyStatus = exports.getDashboardDeviceBySerial = exports.getSensorLog = exports.getDeviceStatus = exports.getAllDevices = void 0;
const db_1 = require("../utils/db");
const db_2 = __importDefault(require("../../db/db"));
// Return all devices for dashboard
const getAllDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, db_1.query)('SELECT * FROM device');
        res.json(result.rows || result);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAllDevices = getAllDevices;
// Fetch real-time device status from device_status table
const getDeviceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let deviceId = req.params.id;
    // If no deviceId param, use authenticated user's device
    if (!deviceId && ((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId)) {
        // Query user's device_id
        const [userRows] = yield db_2.default.query('SELECT device_id FROM user WHERE user_id = ?', [req.user.userId]);
        const userRowArr = userRows;
        if (userRowArr.length > 0 && userRowArr[0].device_id) {
            deviceId = userRowArr[0].device_id;
        }
    }
    if (!deviceId) {
        return res.status(400).json({ success: false, message: 'No device ID found for user.' });
    }
    try {
        const [rows] = yield db_2.default.query(`SELECT * FROM device_status WHERE device_id = ?`, [deviceId]);
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json({ success: true, data: rows[0] });
        }
        else {
            res.status(404).json({ success: false, message: 'No status found for device.' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch device status', error: error instanceof Error ? error.message : error });
    }
});
exports.getDeviceStatus = getDeviceStatus;
// Fetch recent sensor events from activity_log for dashboard sensor card
const getSensorLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch the latest 20 sensor events (can adjust as needed)
        const [rows] = yield db_2.default.query(`
            SELECT al.id, al.device_id, d.serial_number, al.event_type, al.payload, al.timestamp
            FROM activity_log al
            JOIN device d ON al.device_id = d.device_id
            ORDER BY al.timestamp DESC
            LIMIT 20
        `);
        // Parse payload JSON and flatten for frontend
        const data = rows.map(row => {
            let payload = {};
            try {
                payload = row.payload ? JSON.parse(row.payload) : {};
            }
            catch (e) {
                payload = {};
            }
            return Object.assign(Object.assign({ id: row.id, device_id: row.device_id, serial_number: row.serial_number, event_type: row.event_type }, payload), { timestamp: row.timestamp });
        });
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch sensor log', error: error instanceof Error ? error.message : error });
    }
});
exports.getSensorLog = getSensorLog;
// Get dashboard device info by serial number
const getDashboardDeviceBySerial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serialNumber = req.params.serial_number;
    try {
        const [deviceRows] = yield db_2.default.query(`SELECT * FROM device WHERE serial_number = ? LIMIT 1`, [serialNumber]);
        const device = deviceRows[0];
        if (!device) {
            return res.status(404).json({ error: 'Device not found in device table' });
        }
        const [locationRows] = yield db_2.default.query(`SELECT * FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1`, [device.device_id]);
        const location = locationRows[0];
        res.status(200).json(Object.assign(Object.assign({}, device), location));
    }
    catch (error) {
        console.error('[Dashboard Device Serial Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getDashboardDeviceBySerial = getDashboardDeviceBySerial;
const getEmergencyStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_2.default.query(`
            SELECT d.device_id AS device_id, d.serial_number, a.alert_id AS alert_id, a.alert_type, a.alert_description, a.created_at,
                   a.trigger_type
            FROM device d
            LEFT JOIN (
                SELECT alert.* FROM alert
                INNER JOIN (
                    SELECT device_id, MAX(created_at) AS max_created FROM alert WHERE alert_type = 'emergency' GROUP BY device_id
                ) latest ON alert.device_id = latest.device_id AND alert.created_at = latest.max_created AND alert.alert_type = 'emergency'
            ) a ON d.device_id = a.device_id
            ORDER BY d.device_id ASC
        `);
        // Ensure trigger_type is always present in the response
        const mappedRows = rows.map(row => (Object.assign(Object.assign({}, row), { trigger_type: row.trigger_type !== undefined ? row.trigger_type : null })));
        res.status(200).json({ success: true, data: mappedRows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch emergency status', error: error instanceof Error ? error.message : error });
    }
});
exports.getEmergencyStatus = getEmergencyStatus;
const getNightReflectorStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_2.default.query(`
            SELECT n.device_id, d.serial_number, n.status, n.timestamp AS last_checked
            FROM night_reflector_status n
            JOIN device d ON n.device_id = d.device_id
            WHERE n.timestamp = (
                SELECT MAX(timestamp) FROM night_reflector_status WHERE device_id = n.device_id
            )
            ORDER BY n.device_id ASC
        `);
        // Ensure last_checked is always present in the response
        const mappedRows = rows.map(row => (Object.assign(Object.assign({}, row), { last_checked: row.last_checked !== undefined ? row.last_checked : null })));
        res.status(200).json({ success: true, data: mappedRows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch night reflector status', error: error instanceof Error ? error.message : error });
    }
});
exports.getNightReflectorStatus = getNightReflectorStatus;
const getActivityLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_2.default.query(`
            SELECT d.device_id AS device_id, d.serial_number, al.id AS activity_id, al.event_type AS activity_type, al.timestamp
            FROM device d
            LEFT JOIN (
                SELECT al1.* FROM activity_log al1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM activity_log al1
                    WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
                    GROUP BY device_id
                ) latest ON al1.device_id = latest.device_id AND al1.timestamp = latest.max_ts
                WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
            ) al ON d.device_id = al.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity log', error: error instanceof Error ? error.message : error });
    }
});
exports.getActivityLog = getActivityLog;
const getLocationData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        // Get current user's device_id
        const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        const [userRows] = yield db_2.default.query('SELECT device_id FROM user WHERE user_id = ?', [userId]);
        const userRowArr = userRows;
        if (!userRowArr.length || !userRowArr[0].device_id) {
            return res.status(404).json({ success: false, message: 'No device found for user.' });
        }
        const deviceId = userRowArr[0].device_id;
        // Get latest location for this device
        const [rows] = yield db_2.default.query(`
            SELECT l.device_id, d.serial_number, l.latitude, l.longitude, l.timestamp,
                   l.street_name, l.city_name, l.place_name, l.context_tag
            FROM location_log l
            JOIN device d ON l.device_id = d.device_id
            WHERE l.device_id = ?
            ORDER BY l.timestamp DESC
            LIMIT 1
        `, [deviceId]);
        const mappedRows = rows.map((row) => {
            var _a, _b, _c, _d;
            return (Object.assign(Object.assign({}, row), { street_name: (_a = row.street_name) !== null && _a !== void 0 ? _a : null, city_name: (_b = row.city_name) !== null && _b !== void 0 ? _b : null, place_name: (_c = row.place_name) !== null && _c !== void 0 ? _c : null, context_tag: (_d = row.context_tag) !== null && _d !== void 0 ? _d : null }));
        });
        res.status(200).json({ success: true, data: mappedRows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch location data', error: error instanceof Error ? error.message : error });
    }
});
exports.getLocationData = getLocationData;
// Device Info Modal endpoint
const getDeviceInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e, _f;
    const deviceId = req.params.id;
    try {
        const [rows] = yield db_2.default.query(`SELECT * FROM dashboard_latest WHERE device_id = ? LIMIT 1`, [deviceId]);
        const result = rows;
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        // Explicitly include contextual fields in response
        const device = result[0];
        res.status(200).json(Object.assign(Object.assign({}, device), { street_name: (_c = device.street_name) !== null && _c !== void 0 ? _c : null, place_name: (_d = device.place_name) !== null && _d !== void 0 ? _d : null, context_tag: (_e = device.context_tag) !== null && _e !== void 0 ? _e : null, city_name: (_f = device.city_name) !== null && _f !== void 0 ? _f : null }));
    }
    catch (error) {
        console.error('[Device Info Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getDeviceInfo = getDeviceInfo;
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        // Get all dashboard_latest rows (for cards, etc)
        const [rows] = yield db_2.default.query('SELECT * FROM dashboard_latest ORDER BY device_id ASC');
        // Get current user info and their assigned device's serial_number
        let user = null;
        if ((_g = req.user) === null || _g === void 0 ? void 0 : _g.userId) {
            // Get user row
            const [userRows] = yield db_2.default.query('SELECT * FROM user WHERE user_id = ?', [req.user.userId]);
            const userRowArr = userRows;
            if (userRowArr.length > 0) {
                user = Object.assign({}, userRowArr[0]);
                // Get device serial_number if user has device_id
                if (user.device_id) {
                    const [deviceRows] = yield db_2.default.query('SELECT serial_number FROM device WHERE device_id = ?', [user.device_id]);
                    const deviceRowArr = deviceRows;
                    if (deviceRowArr.length > 0) {
                        user.serial_number = deviceRowArr[0].serial_number;
                    }
                    else {
                        user.serial_number = null;
                    }
                }
                else {
                    user.serial_number = null;
                }
            }
        }
        res.status(200).json({
            user,
            data: rows
        });
    }
    catch (error) {
        console.error('[Dashboard SQL Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getDashboardData = getDashboardData;
const getBatteryLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_2.default.query(`
      SELECT b.device_id, d.serial_number, b.battery_level, b.timestamp
      FROM battery_status b
      JOIN device d ON b.device_id = d.device_id
      WHERE b.timestamp = (
        SELECT MAX(timestamp) FROM battery_status WHERE device_id = b.device_id
      )
      ORDER BY b.device_id ASC
    `);
        res.status(200).json({ data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch battery levels', error: error instanceof Error ? error.message : error });
    }
});
exports.getBatteryLevels = getBatteryLevels;
const getRecentAlerts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json([]); // TODO: Implement real alert aggregation
});
exports.getRecentAlerts = getRecentAlerts;
const getReflectorStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json([]); // TODO: Implement real reflector status aggregation
});
exports.getReflectorStatus = getReflectorStatus;
const getActivitySummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_2.default.query(`
            SELECT d.device_id AS device_id, d.serial_number, al.id AS activity_id, al.event_type AS activity_type, al.timestamp
            FROM device d
            LEFT JOIN (
                SELECT al1.* FROM activity_log al1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM activity_log al1
                    WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
                    GROUP BY device_id
                ) latest ON al1.device_id = latest.device_id AND al1.timestamp = latest.max_ts
                WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
            ) al ON d.device_id = al.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity summary', error: error instanceof Error ? error.message : error });
    }
});
exports.getActivitySummary = getActivitySummary;
