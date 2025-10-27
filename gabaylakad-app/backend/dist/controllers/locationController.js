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
exports.deleteLocation = exports.updateLocation = exports.createLocation = exports.getLocationById = exports.getAllLocations = exports.getLocationHistory = exports.getDeviceInfo = exports.getLocationHistoryBySerial = exports.getDeviceInfoById = void 0;
// Get latest device info for any device by deviceId (admin/flexible)
const getDeviceInfoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const { deviceId } = req.params;
    if (!deviceId) {
        return res.status(400).json({ error: 'Missing deviceId parameter' });
    }
    try {
        // Always join device table to get serial_number
        const [rows] = yield db_1.default.query(`SELECT dl.*, d.serial_number
             FROM dashboard_latest dl
             LEFT JOIN device d ON dl.device_id = d.device_id
             WHERE dl.device_id = ?
             LIMIT 1`, [deviceId]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        const device = rows[0];
        let serial_number = (_a = device.serial_number) !== null && _a !== void 0 ? _a : null;
        if (!serial_number && device.device_id) {
            const [devRows] = yield db_1.default.query('SELECT serial_number FROM device WHERE device_id = ?', [device.device_id]);
            if (devRows && devRows.length > 0) {
                serial_number = (_b = devRows[0].serial_number) !== null && _b !== void 0 ? _b : null;
            }
        }
        res.status(200).json(Object.assign(Object.assign({}, device), { street_name: (_c = device.street_name) !== null && _c !== void 0 ? _c : null, place_name: (_d = device.place_name) !== null && _d !== void 0 ? _d : null, context_tag: (_e = device.context_tag) !== null && _e !== void 0 ? _e : null, city_name: (_f = device.city_name) !== null && _f !== void 0 ? _f : null, serial_number: serial_number }));
    }
    catch (error) {
        console.error('[getDeviceInfoById Error]', error);
        return res.status(500).json({ message: 'Failed to fetch device info by id' });
    }
});
exports.getDeviceInfoById = getDeviceInfoById;
const getLocationHistoryBySerial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    console.log(`[LOCATION] getLocationHistoryBySerial called by user: ${(_g = req.user) === null || _g === void 0 ? void 0 : _g.userId}, serial: ${req.params.serial_number}`);
    const { serial_number } = req.params;
    if (!serial_number) {
        return res.status(400).json({ success: false, message: 'Missing serial_number parameter' });
    }
    try {
        // Always join device table to get serial_number
        const sql = `SELECT ll.*, d.serial_number FROM location_log ll LEFT JOIN device d ON ll.device_id = d.device_id WHERE d.serial_number = ? ORDER BY ll.timestamp DESC LIMIT 100`;
        const queryResult = yield db_1.default.query(sql, [serial_number]);
        const rows = Array.isArray(queryResult[0]) ? queryResult[0] : [];
        // Ensure every row has serial_number from device table
        const mapped = rows.map((row) => {
            var _a;
            return (Object.assign(Object.assign({}, row), { serial_number: (_a = row.serial_number) !== null && _a !== void 0 ? _a : null }));
        });
        return res.json({ success: true, data: mapped });
    }
    catch (error) {
        console.error('[LocationHistoryBySerial SQL Error]', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch location history by serial' });
    }
});
exports.getLocationHistoryBySerial = getLocationHistoryBySerial;
const db_1 = __importDefault(require("../../db/db"));
const reverseGeocode_1 = require("../utils/reverseGeocode");
// Get latest device info including POI fields
const getDeviceInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l, _m, _o, _p, _q;
    console.log(`[LOCATION] getDeviceInfo called by user: ${(_h = req.user) === null || _h === void 0 ? void 0 : _h.userId}`);
    const userId = (_j = req.user) === null || _j === void 0 ? void 0 : _j.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized: No userId in token' });
    }
    try {
        // Get device_id for authenticated user
        const [userRows] = yield db_1.default.query('SELECT device_id FROM user WHERE user_id = ?', [userId]);
        if (!userRows || userRows.length === 0 || !userRows[0].device_id) {
            return res.status(404).json({ message: 'No device found for user' });
        }
        const deviceId = userRows[0].device_id;
        // Always join device table to get serial_number
        const [rows] = yield db_1.default.query(`SELECT dl.*, d.serial_number
                 FROM dashboard_latest dl
                 LEFT JOIN device d ON dl.device_id = d.device_id
                 WHERE dl.device_id = ?
                 LIMIT 1`, [deviceId]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        const device = rows[0];
        // If serial_number is missing, fetch from device table
        let serial_number = (_k = device.serial_number) !== null && _k !== void 0 ? _k : null;
        if (!serial_number && device.device_id) {
            const [devRows] = yield db_1.default.query('SELECT serial_number FROM device WHERE device_id = ?', [device.device_id]);
            if (devRows && devRows.length > 0) {
                serial_number = (_l = devRows[0].serial_number) !== null && _l !== void 0 ? _l : null;
            }
        }
        res.status(200).json(Object.assign(Object.assign({}, device), { street_name: (_m = device.street_name) !== null && _m !== void 0 ? _m : null, place_name: (_o = device.place_name) !== null && _o !== void 0 ? _o : null, context_tag: (_p = device.context_tag) !== null && _p !== void 0 ? _p : null, city_name: (_q = device.city_name) !== null && _q !== void 0 ? _q : null, serial_number: serial_number }));
    }
    catch (error) {
        console.error('[getDeviceInfo Error]', error);
        return res.status(500).json({ message: 'Failed to fetch device info' });
    }
});
exports.getDeviceInfo = getDeviceInfo;
const getLocationHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _r, _s;
    console.log(`[LOCATION] getLocationHistory called by user: ${(_r = req.user) === null || _r === void 0 ? void 0 : _r.userId}`);
    const userId = (_s = req.user) === null || _s === void 0 ? void 0 : _s.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No userId in token' });
    }
    try {
        // Get device_id for authenticated user
        const [userRows] = yield db_1.default.query('SELECT device_id FROM user WHERE user_id = ?', [userId]);
        if (!userRows || userRows.length === 0 || !userRows[0].device_id) {
            return res.status(404).json({ success: false, message: 'No device found for user' });
        }
        const deviceId = userRows[0].device_id;
        const sql = `SELECT * FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 100`;
        const [rows] = yield db_1.default.query(sql, [deviceId]);
        return res.json({ success: true, data: rows });
    }
    catch (error) {
        console.error('[LocationHistory SQL Error]', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch location history' });
    }
});
exports.getLocationHistory = getLocationHistory;
// TODO: integrate with IoT device data stream
const getAllLocations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _t;
    console.log(`[LOCATION] getAllLocations called by user: ${(_t = req.user) === null || _t === void 0 ? void 0 : _t.userId}`);
    try {
        const [rows] = yield db_1.default.query('SELECT * FROM location');
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.getAllLocations = getAllLocations;
const getLocationById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _u;
    console.log(`[LOCATION] getLocationById called by user: ${(_u = req.user) === null || _u === void 0 ? void 0 : _u.userId}, locationId: ${req.params.id}`);
    try {
        const { id } = req.params;
        const [rows] = yield db_1.default.query('SELECT * FROM location WHERE location_id = ?', [id]);
        const locations = rows;
        if (locations.length === 0)
            return res.status(404).json({ message: 'Location not found' });
        res.json(locations[0]);
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
        // Get latest device info including POI fields
        const getDeviceInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
            const { deviceId } = req.params;
            if (!deviceId) {
                return res.status(400).json({ message: 'Missing deviceId parameter' });
            }
            try {
                // Get latest location log for device
                const sql = `SELECT * FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1`;
                const [rows] = yield db_1.default.query(sql, [deviceId]);
                if (!rows || rows.length === 0) {
                    return res.status(404).json({ message: 'No location found for device' });
                }
                // Return all fields including POI
                return res.json(rows[0]);
            }
            catch (error) {
                console.error('[getDeviceInfo Error]', error);
                return res.status(500).json({ message: 'Failed to fetch device info' });
            }
        });
    }
});
exports.getLocationById = getLocationById;
const createLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _v;
    try {
        // Accept and validate contextual fields for location tracking
        const { device_id, latitude, longitude, altitude, speed, heading, accuracy, signal_strength, street_name, city_name, place_name, context_tag, timestamp } = req.body;
        if (!device_id || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'Missing required location fields' });
        }
        // Always fetch serial_number from device table using device_id
        let serial_number = null;
        try {
            const [deviceRows] = yield db_1.default.query('SELECT serial_number FROM device WHERE device_id = ?', [device_id]);
            if (deviceRows && deviceRows.length > 0) {
                serial_number = (_v = deviceRows[0].serial_number) !== null && _v !== void 0 ? _v : null;
            }
            else {
                serial_number = null;
            }
        }
        catch (err) {
            console.error('[SerialNumber Fetch Error]', err);
            serial_number = null;
        }
        // If any contextual field is missing, perform reverse geocoding
        let finalStreet = street_name;
        let finalCity = city_name;
        let finalPlace = place_name;
        let finalContext = context_tag;
        let poi_name = null, poi_type = null, poi_distance_km = null, poi_distance_m = null, poi_lat = null, poi_lon = null;
        let geo = null;
        if (!street_name || !city_name || !place_name || !context_tag) {
            geo = yield (0, reverseGeocode_1.reverseGeocodeNominatim)(latitude, longitude);
            finalStreet = finalStreet || geo.street_name;
            finalCity = finalCity || geo.city_name;
            finalPlace = finalPlace || geo.place_name;
            finalContext = finalContext || geo.context_tag;
        }
        // Always set a default street name if missing
        if (!finalStreet) {
            finalStreet = 'Unknown Street';
        }
        // Always try to get POI info from reverse geocode (if not already done)
        if (!geo)
            geo = yield (0, reverseGeocode_1.reverseGeocodeNominatim)(latitude, longitude);
        poi_name = geo.poi_name;
        poi_type = geo.poi_type;
        poi_distance_km = geo.poi_distance_km;
        poi_distance_m = geo.poi_distance_m;
        poi_lat = geo.poi_lat;
        poi_lon = geo.poi_lon;
        // If no POI found, use findNearestPOI to get the closest POI of any type within 2km, then 20km if still not found
        if (!poi_name && latitude && longitude) {
            let nearestPOI = yield (0, reverseGeocode_1.findNearestPOI)(latitude, longitude, 2000);
            if (!nearestPOI) {
                // Try with a much larger radius (20km)
                nearestPOI = yield (0, reverseGeocode_1.findNearestPOI)(latitude, longitude, 20000);
            }
            if (nearestPOI) {
                poi_name = nearestPOI.poi_name;
                poi_type = nearestPOI.poi_type;
                poi_distance_km = nearestPOI.poi_distance_km;
                poi_distance_m = nearestPOI.poi_distance_m;
                poi_lat = nearestPOI.poi_lat;
                poi_lon = nearestPOI.poi_lon;
            }
            else {
                // Fallback values if no POI found
                poi_name = 'No POI found nearby';
                poi_type = 'none';
                poi_distance_km = -1;
                poi_distance_m = -1;
                poi_lat = null;
                poi_lon = null;
                console.log('[POI Fallback] No POI found for lat:', latitude, 'lon:', longitude);
            }
        }
        // Log POI fields for debugging (after assignment, inside correct scope)
        console.log('[POI Debug]', {
            poi_name: poi_name !== null && poi_name !== void 0 ? poi_name : null,
            poi_type: poi_type !== null && poi_type !== void 0 ? poi_type : null,
            poi_distance_km: poi_distance_km !== null && poi_distance_km !== void 0 ? poi_distance_km : null,
            poi_distance_m: poi_distance_m !== null && poi_distance_m !== void 0 ? poi_distance_m : null,
            poi_lat: poi_lat !== null && poi_lat !== void 0 ? poi_lat : null,
            poi_lon: poi_lon !== null && poi_lon !== void 0 ? poi_lon : null
        });
        // Build location object for insertion, including POI fields
        const location = {
            device_id,
            serial_number: serial_number !== null && serial_number !== void 0 ? serial_number : null,
            latitude,
            longitude,
            altitude: altitude !== null && altitude !== void 0 ? altitude : null,
            speed: speed !== null && speed !== void 0 ? speed : null,
            heading: heading !== null && heading !== void 0 ? heading : null,
            accuracy: accuracy !== null && accuracy !== void 0 ? accuracy : null,
            signal_strength: signal_strength !== null && signal_strength !== void 0 ? signal_strength : null,
            street_name: finalStreet !== null && finalStreet !== void 0 ? finalStreet : null,
            city_name: finalCity !== null && finalCity !== void 0 ? finalCity : null,
            place_name: finalPlace !== null && finalPlace !== void 0 ? finalPlace : null,
            context_tag: finalContext !== null && finalContext !== void 0 ? finalContext : null,
            timestamp,
            poi_name: poi_name !== null && poi_name !== void 0 ? poi_name : null,
            poi_type: poi_type !== null && poi_type !== void 0 ? poi_type : null,
            poi_distance_m: poi_distance_m !== null && poi_distance_m !== void 0 ? poi_distance_m : null,
            poi_distance_km: poi_distance_km !== null && poi_distance_km !== void 0 ? poi_distance_km : null,
            poi_lat: poi_lat !== null && poi_lat !== void 0 ? poi_lat : null,
            poi_lon: poi_lon !== null && poi_lon !== void 0 ? poi_lon : null,
            poi_distance: poi_distance_km !== null && poi_distance_km !== void 0 ? poi_distance_km : null
        };
        console.log('[LocationLog Insert]', location);
        const [result] = yield db_1.default.query('INSERT INTO location_log SET ?', [location]);
        const insertResult = result;
        res.status(201).json(Object.assign({ log_id: insertResult.insertId }, location));
        // Emit real-time update if valid coordinates
        if (device_id && latitude && longitude) {
            const io = req.app.get('io');
            if (io) {
                io.emit('location_update', {
                    device_id,
                    serial_number,
                    latitude,
                    longitude,
                    street_name: finalStreet,
                    city_name: finalCity,
                    place_name: finalPlace,
                    context_tag: finalContext,
                    timestamp: timestamp || new Date().toISOString(),
                    poi_name,
                    poi_type,
                    poi_distance_km,
                    poi_distance_m,
                    poi_lat,
                    poi_lon
                });
                console.log(`📡 Emitting location_update for device ${device_id}`);
            }
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.createLocation = createLocation;
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const location = req.body;
        const [result] = yield db_1.default.query('UPDATE location SET ? WHERE location_id = ?', [location, id]);
        const updateResult = result;
        if (updateResult.affectedRows === 0)
            return res.status(404).json({ message: 'Location not found' });
        res.json(Object.assign({ location_id: id }, location));
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.updateLocation = updateLocation;
const deleteLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const [result] = yield db_1.default.query('DELETE FROM location WHERE location_id = ?', [id]);
        const deleteResult = result;
        if (deleteResult.affectedRows === 0)
            return res.status(404).json({ message: 'Location not found' });
        res.json({ message: 'Location deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
});
exports.deleteLocation = deleteLocation;
