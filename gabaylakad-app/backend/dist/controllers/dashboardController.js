"use strict";
// --- Dashboard Card Endpoints ---
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
exports.getActivitySummary = exports.getReflectorStatus = exports.getRecentAlerts = exports.getBatteryLevels = exports.getDeviceStatus = exports.getDashboardData = exports.getDeviceInfo = exports.getLocationData = exports.getActivityLog = exports.getNightReflectorStatus = exports.getEmergencyStatus = void 0;
const getEmergencyStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query(`
            SELECT d.device_id AS device_id, d.serial_number, a.alert_id AS alert_id, a.alert_type, a.alert_description, a.created_at
            FROM device d
            LEFT JOIN (
                SELECT alert.* FROM alert
                INNER JOIN (
                    SELECT device_id, MAX(created_at) AS max_created FROM alert WHERE alert_type = 'emergency' GROUP BY device_id
                ) latest ON alert.device_id = latest.device_id AND alert.created_at = latest.max_created AND alert.alert_type = 'emergency'
            ) a ON d.device_id = a.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch emergency status', error: error instanceof Error ? error.message : error });
    }
});
exports.getEmergencyStatus = getEmergencyStatus;
const getNightReflectorStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query(`
            SELECT d.device_id AS device_id, d.serial_number, nrs.reflector_id AS status_id, nrs.status, nrs.timestamp
            FROM device d
            LEFT JOIN (
                SELECT nrs1.* FROM night_reflector_status nrs1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM night_reflector_status GROUP BY device_id
                ) latest ON nrs1.device_id = latest.device_id AND nrs1.timestamp = latest.max_ts
            ) nrs ON d.device_id = nrs.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch night reflector status', error: error instanceof Error ? error.message : error });
    }
});
exports.getNightReflectorStatus = getNightReflectorStatus;
const getActivityLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query(`
            SELECT d.device_id AS device_id, d.serial_number, al.id AS activity_id, al.event_type AS activity_type, al.timestamp
            FROM device d
            LEFT JOIN (
                SELECT al1.* FROM activity_log al1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM activity_log GROUP BY device_id
                ) latest ON al1.device_id = latest.device_id AND al1.timestamp = latest.max_ts
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
    try {
        const [rows] = yield db_1.default.query(`
            SELECT d.device_id AS device_id, d.serial_number, ll.log_id AS location_id, ll.latitude, ll.longitude, ll.timestamp
            FROM device d
            LEFT JOIN (
                SELECT ll1.* FROM location_log ll1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM location_log GROUP BY device_id
                ) latest ON ll1.device_id = latest.device_id AND ll1.timestamp = latest.max_ts
            ) ll ON d.device_id = ll.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch location data', error: error instanceof Error ? error.message : error });
    }
});
exports.getLocationData = getLocationData;
const db_1 = __importDefault(require("../../db/db"));
// Device Info Modal endpoint
const getDeviceInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceId = req.params.id;
    try {
        const [rows] = yield db_1.default.query(`SELECT * FROM dashboard_latest WHERE device_id = ? LIMIT 1`, [deviceId]);
        const result = rows;
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        res.status(200).json(result[0]);
    }
    catch (error) {
        console.error('[Device Info Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getDeviceInfo = getDeviceInfo;
const getDashboardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM dashboard_latest ORDER BY device_id ASC');
        res.status(200).json(rows);
    }
    catch (error) {
        console.error('[Dashboard SQL Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getDashboardData = getDashboardData;
const getDeviceStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json([]); // TODO: Implement real device status aggregation
});
exports.getDeviceStatus = getDeviceStatus;
const getBatteryLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM dashboard_battery_latest ORDER BY device_id ASC');
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
        const [rows] = yield db_1.default.query('SELECT * FROM dashboard_activity_latest ORDER BY device_id ASC');
        res.status(200).json({ data: rows });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity summary', error: error instanceof Error ? error.message : error });
    }
});
exports.getActivitySummary = getActivitySummary;
