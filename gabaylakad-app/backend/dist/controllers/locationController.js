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
exports.deleteLocation = exports.updateLocation = exports.createLocation = exports.getLocationById = exports.getAllLocations = exports.getLocationHistory = void 0;
const db_1 = __importDefault(require("../../db/db"));
const getLocationHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { device_id } = req.params;
    if (!device_id) {
        return res.status(400).json({ success: false, message: 'Missing device_id parameter' });
    }
    try {
        const sql = `SELECT * FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 100`;
        const [rows] = yield db_1.default.query(sql, [device_id]);
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
    }
});
exports.getLocationById = getLocationById;
const createLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Accept and validate contextual fields for location tracking
        const { device_id, latitude, longitude, altitude, speed, heading, accuracy, signal_strength, street_name, city_name, place_name, context_tag, timestamp } = req.body;
        if (!device_id || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ message: 'Missing required location fields' });
        }
        // Build location object for insertion
        const location = {
            device_id,
            latitude,
            longitude,
            altitude,
            speed,
            heading,
            accuracy,
            signal_strength,
            street_name,
            city_name,
            place_name,
            context_tag,
            timestamp
        };
        const [result] = yield db_1.default.query('INSERT INTO location_log SET ?', [location]);
        const insertResult = result;
        res.status(201).json(Object.assign({ log_id: insertResult.insertId }, location));
        // Emit real-time update if valid coordinates
        if (device_id && latitude && longitude) {
            const io = req.app.get('io');
            if (io) {
                io.emit('location_update', {
                    device_id,
                    latitude,
                    longitude,
                    street_name,
                    city_name,
                    place_name,
                    context_tag,
                    timestamp: timestamp || new Date().toISOString()
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
