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
exports.runSimulation = exports.insertActivityLog = exports.insertAlert = exports.insertNightReflectorStatus = exports.insertLocationLog = exports.insertBatteryStatus = exports.insertDevice = void 0;
const db_1 = __importDefault(require("../../db/db"));
const http_1 = __importDefault(require("http"));
const reverseGeocode_1 = require("./reverseGeocode");
// socket client is optional and only required when emitting directly
let ioClient = null;
try {
    // lazy require to avoid adding dependency unless used
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ioClient = require('socket.io-client');
}
catch (err) {
    ioClient = null;
}
// Helper: get a random int in range
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Helper: get a random float in range
function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}
// Cebu bounding box
const CEBU = {
    latMin: 10.2800,
    latMax: 10.3700,
    lonMin: 123.8600,
    lonMax: 123.9400
};
function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}
function metersToLatDeg(m) {
    return m / 111320; // approximate meters per degree latitude
}
function metersToLonDeg(m, lat) {
    const latRad = lat * (Math.PI / 180);
    return m / (111320 * Math.cos(latRad));
}
function postLocationToApi(port, payload) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(payload);
        const options = {
            hostname: '127.0.0.1',
            port,
            path: '/api/locations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        const req = http_1.default.request(options, (res) => {
            // consume response
            res.on('data', () => { });
            res.on('end', () => resolve());
        });
        req.on('error', (err) => reject(err));
        req.write(data);
        req.end();
    });
}
function emitLocationToSocket(backendUrl, payload) {
    return new Promise((resolve, reject) => {
        if (!ioClient)
            return reject(new Error('socket.io-client not available'));
        try {
            const socket = ioClient(backendUrl, { transports: ['websocket'] });
            socket.on('connect', () => {
                socket.emit('location_update', payload);
                socket.disconnect();
                resolve();
            });
            // timeout in case connect never happens
            setTimeout(() => {
                try {
                    socket.disconnect();
                }
                catch (e) { }
                reject(new Error('socket connect timeout'));
            }, 3000);
        }
        catch (err) {
            reject(err);
        }
    });
}
// Insert a sample device if none exists
function insertDevice() {
    return __awaiter(this, void 0, void 0, function* () {
        const [rows] = yield db_1.default.query('SELECT device_id FROM device LIMIT 1');
        if (rows.length === 0) {
            yield db_1.default.query("INSERT INTO device (serial_number) VALUES (?)", [
                'DEV-' + randInt(1000, 9999)
            ]);
            console.log('Inserted sample device');
        }
        else {
            console.log('Device already exists');
        }
    });
}
exports.insertDevice = insertDevice;
// Insert random battery status
function insertBatteryStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const [devices] = yield db_1.default.query('SELECT device_id, serial_number FROM device');
        for (const device of devices) {
            // Device-specific battery offset for uniqueness
            const offset = (device.device_id % 13) * 2.5;
            const battery = (randFloat(10, 100 - offset) + offset).toFixed(1);
            yield db_1.default.query('INSERT INTO battery_status (device_id, battery_level) VALUES (?, ?)', [device.device_id, battery]);
            console.log(`Inserted battery status for device ${device.device_id}: ${battery}%`);
        }
    });
}
exports.insertBatteryStatus = insertBatteryStatus;
// Insert random location
function insertLocationLog() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return __awaiter(this, void 0, void 0, function* () {
        const [devices] = yield db_1.default.query('SELECT device_id FROM device');
        for (const device of devices) {
            let valid = false;
            let lat = 0, lng = 0;
            let geo = null;
            let poi = null;
            // Device-specific offset for location uniqueness
            const latOffset = ((device.device_id % 17) * 0.0015) + randFloat(0, 0.002);
            const lngOffset = ((device.device_id % 19) * 0.0012) + randFloat(0, 0.002);
            while (!valid) {
                lat = clamp(randFloat(CEBU.latMin, CEBU.latMax) + latOffset, CEBU.latMin, CEBU.latMax);
                lng = clamp(randFloat(CEBU.lonMin, CEBU.lonMax) + lngOffset, CEBU.lonMin, CEBU.lonMax);
                geo = yield (0, reverseGeocode_1.reverseGeocodeNominatim)(lat, lng);
                if (geo && geo.city_name && geo.city_name.toLowerCase().includes('cebu city')) {
                    valid = true;
                }
            }
            if (geo && geo.street_name && geo.place_name) {
                // Always call findNearestPOI and log the result
                const { findNearestPOI } = require('./reverseGeocode');
                poi = yield findNearestPOI(lat, lng, 2000);
                if (!poi) {
                    poi = yield findNearestPOI(lat, lng, 20000);
                }
                if (poi) {
                    console.log(`[Simulator POI] device ${device.device_id}: POI: ${poi.poi_name}, type: ${poi.poi_type}, distance: ${poi.poi_distance_m}m (${poi.poi_distance_km.toFixed(2)}km)`);
                }
                else {
                    console.log(`[Simulator POI] device ${device.device_id}: No POI found within 20km.`);
                }
                yield db_1.default.query(`INSERT INTO location_log (
          device_id, serial_number, latitude, longitude, altitude, speed, heading, accuracy, signal_strength,
          timestamp, street_name, city_name, place_name, context_tag,
          poi_name, poi_type, poi_distance_m, poi_distance_km, poi_lat, poi_lon, poi_distance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    device.device_id,
                    (_a = device.serial_number) !== null && _a !== void 0 ? _a : null,
                    lat,
                    lng,
                    (_b = geo.altitude) !== null && _b !== void 0 ? _b : null,
                    (_c = geo.speed) !== null && _c !== void 0 ? _c : null,
                    (_d = geo.heading) !== null && _d !== void 0 ? _d : null,
                    (_e = geo.accuracy) !== null && _e !== void 0 ? _e : null,
                    (_f = geo.signal_strength) !== null && _f !== void 0 ? _f : null,
                    (_g = geo.street_name) !== null && _g !== void 0 ? _g : null,
                    (_h = geo.city_name) !== null && _h !== void 0 ? _h : null,
                    (_j = geo.place_name) !== null && _j !== void 0 ? _j : null,
                    (_k = geo.context_tag) !== null && _k !== void 0 ? _k : null,
                    (_l = poi === null || poi === void 0 ? void 0 : poi.poi_name) !== null && _l !== void 0 ? _l : null,
                    (_m = poi === null || poi === void 0 ? void 0 : poi.poi_type) !== null && _m !== void 0 ? _m : null,
                    (_o = poi === null || poi === void 0 ? void 0 : poi.poi_distance_m) !== null && _o !== void 0 ? _o : null,
                    (_p = poi === null || poi === void 0 ? void 0 : poi.poi_distance_km) !== null && _p !== void 0 ? _p : null,
                    (_q = poi === null || poi === void 0 ? void 0 : poi.poi_lat) !== null && _q !== void 0 ? _q : null,
                    (_r = poi === null || poi === void 0 ? void 0 : poi.poi_lon) !== null && _r !== void 0 ? _r : null,
                    (_s = poi === null || poi === void 0 ? void 0 : poi.poi_distance_km) !== null && _s !== void 0 ? _s : null
                ]);
                console.log(`Inserted location for device ${device.device_id}: (${lat.toFixed(6)}, ${lng.toFixed(6)}) with context: ${geo.street_name}, ${geo.place_name}, ${geo.context_tag}, POI: ${poi === null || poi === void 0 ? void 0 : poi.poi_name}`);
            }
            else {
                console.log(`[Simulator] Skipped location insert for device ${device.device_id}: missing street_name or place_name.`);
            }
        }
    });
}
exports.insertLocationLog = insertLocationLog;
// Insert random night reflector status
function insertNightReflectorStatus() {
    return __awaiter(this, void 0, void 0, function* () {
        const [devices] = yield db_1.default.query('SELECT device_id FROM device');
        for (const device of devices) {
            const status = Math.random() > 0.5 ? 'on' : 'off';
            yield db_1.default.query('INSERT INTO night_reflector_status (device_id, status, timestamp) VALUES (?, ?, NOW())', [device.device_id, status]);
            console.log(`Inserted night reflector status for device ${device.device_id}: ${status}`);
        }
    });
}
exports.insertNightReflectorStatus = insertNightReflectorStatus;
// Insert random alert
function insertAlert() {
    return __awaiter(this, void 0, void 0, function* () {
        const [devices] = yield db_1.default.query('SELECT device_id FROM device');
        // Get all user_ids
        const [users] = yield db_1.default.query('SELECT user_id FROM user');
        const userIds = users.map(u => u.user_id);
        for (const device of devices) {
            // Pick a random user_id for each alert
            const userId = userIds.length > 0 ? userIds[randInt(0, userIds.length - 1)] : null;
            if (userId) {
                yield db_1.default.query('INSERT INTO alert (device_id, user_id, alert_type, alert_description, trigger_type, created_at) VALUES (?, ?, ?, ?, ?, NOW())', [device.device_id, userId, 'Emergency', 'Emergency button pressed', 'button']);
                console.log(`Inserted alert for device ${device.device_id}: Emergency button pressed for user ${userId} (trigger: button)`);
            }
            else {
                console.log('No users found, skipping alert insert.');
            }
        }
    });
}
exports.insertAlert = insertAlert;
// Insert realistic smart cane sensor events
function insertActivityLog() {
    return __awaiter(this, void 0, void 0, function* () {
        const [devices] = yield db_1.default.query('SELECT device_id FROM device');
        const directions = ['left', 'right', 'front', 'back'];
        const buttons = ['SOS', 'mode', 'power'];
        for (const device of devices) {
            // Randomly pick an event type (sensor + non-sensor)
            const eventTypes = [
                'obstacle', 'button_press', 'vibration', 'gsm_status',
                'walking', 'idle', 'error'
            ];
            const eventType = eventTypes[randInt(0, eventTypes.length - 1)];
            let payload = { timestamp: new Date().toISOString() };
            switch (eventType) {
                case 'obstacle':
                    payload = {
                        event: 'obstacle',
                        distance: randInt(30, 200),
                        direction: directions[randInt(0, directions.length - 1)],
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'button_press':
                    payload = {
                        event: 'button_press',
                        button: buttons[randInt(0, buttons.length - 1)],
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'vibration':
                    payload = {
                        event: 'vibration',
                        pattern: randInt(1, 3),
                        duration_ms: randInt(100, 1000),
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'gsm_status':
                    payload = {
                        event: 'gsm_status',
                        signal_strength: randInt(0, 31),
                        connected: Math.random() > 0.2,
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'walking':
                    payload = {
                        event: 'walking',
                        speed: randInt(1, 5),
                        step_count: randInt(10, 100),
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'idle':
                    payload = {
                        event: 'idle',
                        duration_min: randInt(1, 60),
                        timestamp: new Date().toISOString()
                    };
                    break;
                case 'error':
                    payload = {
                        event: 'error',
                        code: randInt(100, 999),
                        message: 'Simulated error',
                        timestamp: new Date().toISOString()
                    };
                    break;
                default:
                    payload = { event: eventType, timestamp: new Date().toISOString() };
            }
            yield db_1.default.query('INSERT INTO activity_log (device_id, event_type, payload, timestamp) VALUES (?, ?, ?, NOW())', [device.device_id, eventType, JSON.stringify(payload)]);
            // Update device_status table for real-time status
            let statusUpdate = {};
            switch (eventType) {
                case 'obstacle':
                    statusUpdate = {
                        obstacle_distance: payload.distance,
                        obstacle_severity: 'normal',
                    };
                    break;
                case 'button_press':
                    statusUpdate = {
                        button_action: payload.button,
                    };
                    break;
                case 'vibration':
                    statusUpdate = {
                        vibration_pattern: payload.pattern,
                        vibration_duration: payload.duration_ms,
                    };
                    break;
                case 'gsm_status':
                    statusUpdate = {
                        gsm_connected: payload.connected ? 1 : 0,
                        gsm_signal_strength: payload.signal_strength,
                    };
                    break;
                default:
                    statusUpdate = {};
            }
            if (Object.keys(statusUpdate).length > 0) {
                const columns = Object.keys(statusUpdate).map(k => `${k} = ?`).join(', ');
                const values = Object.values(statusUpdate);
                yield db_1.default.query(`INSERT INTO device_status (device_id, ${Object.keys(statusUpdate).join(', ')}) VALUES (?, ${Object.keys(statusUpdate).map(_ => '?').join(', ')})
        ON DUPLICATE KEY UPDATE ${columns}, updated_at = CURRENT_TIMESTAMP`, [device.device_id, ...values, ...values]);
                console.log(`Updated device_status for device ${device.device_id}:`, statusUpdate);
            }
            console.log(`Inserted activity log for device ${device.device_id}: ${eventType}`);
        }
    });
}
exports.insertActivityLog = insertActivityLog;
// Main simulation runner
function runSimulation() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield insertDevice();
            yield insertBatteryStatus();
            yield insertLocationLog();
            yield insertNightReflectorStatus();
            yield insertAlert();
            yield insertActivityLog();
            console.log('Initial IoT data simulation complete.');
            // Start continuous realistic movement simulation per device if requested
            const continuous = process.argv.includes('--continuous') || process.env.SIMULATE_CONTINUOUS === '1';
            const port = process.env.PORT ? Number(process.env.PORT) : 5000;
            const emitMode = process.argv.includes('--emit-socket') ? 'socket' : process.argv.includes('--emit-api') ? 'api' : process.env.SIMULATE_EMIT_MODE || 'api';
            const backendUrl = process.env.SIMULATOR_BACKEND_URL || `http://localhost:${port}`;
            if (continuous) {
                console.log('Starting continuous movement simulation (Cebu-bounded)');
                setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const [devicesList] = yield db_1.default.query('SELECT device_id, serial_number FROM device');
                        for (const device of devicesList) {
                            // get last known location
                            const [rows] = yield db_1.default.query('SELECT latitude, longitude FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1', [device.device_id]);
                            let lat = rows && rows[0] ? Number(rows[0].latitude) : randFloat(CEBU.latMin, CEBU.latMax);
                            let lng = rows && rows[0] ? Number(rows[0].longitude) : randFloat(CEBU.lonMin, CEBU.lonMax);
                            // Movement mode: walking (70%) or driving (30%)
                            const mode = Math.random() < 0.7 ? 'walking' : 'driving';
                            const meters = mode === 'walking' ? randFloat(1, 8) : randFloat(15, 80); // meters per tick
                            const angle = randFloat(0, Math.PI * 2);
                            const deltaLat = metersToLatDeg(meters) * Math.cos(angle);
                            const deltaLon = metersToLonDeg(meters, lat) * Math.sin(angle);
                            let newLat = lat + deltaLat;
                            let newLng = lng + deltaLon;
                            // clamp to Cebu bounding box
                            newLat = clamp(newLat, CEBU.latMin, CEBU.latMax);
                            newLng = clamp(newLng, CEBU.lonMin, CEBU.lonMax);
                            // Use Nominatim reverse geocoding for contextual fields, retry until Cebu City
                            let geo = null;
                            let tryLat = newLat, tryLng = newLng;
                            let attempts = 0;
                            do {
                                geo = yield (0, reverseGeocode_1.reverseGeocodeNominatim)(tryLat, tryLng);
                                attempts++;
                                // If not Cebu City, pick a new random point in bounding box
                                if (!geo.city_name || !geo.city_name.toLowerCase().includes('cebu city')) {
                                    tryLat = randFloat(CEBU.latMin, CEBU.latMax);
                                    tryLng = randFloat(CEBU.lonMin, CEBU.lonMax);
                                }
                            } while (!geo.city_name || !geo.city_name.toLowerCase().includes('cebu city'));
                            const payload = {
                                device_id: device.device_id,
                                serial_number: device.serial_number,
                                latitude: Number(tryLat.toFixed(6)),
                                longitude: Number(tryLng.toFixed(6)),
                                timestamp: new Date().toISOString(),
                                street_name: geo.street_name,
                                city_name: geo.city_name,
                                place_name: geo.place_name,
                                context_tag: geo.context_tag
                            };
                            // Debug: print payload to verify contextual fields
                            console.log('Simulated location payload:', payload);
                            // Emit according to mode: API (default), socket, or direct DB fallback
                            if (emitMode === 'socket') {
                                try {
                                    yield emitLocationToSocket(backendUrl, payload);
                                    console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via SOCKET`);
                                }
                                catch (err) {
                                    // fallback to API then DB
                                    try {
                                        yield postLocationToApi(port, payload);
                                        console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via API (socket failed)`);
                                    }
                                    catch (err2) {
                                        // Fetch serial_number for device
                                        let serial_number = null;
                                        try {
                                            const [rows] = yield db_1.default.query('SELECT serial_number FROM device WHERE device_id = ?', [device.device_id]);
                                            if (Array.isArray(rows) && rows.length > 0)
                                                serial_number = rows[0].serial_number;
                                        }
                                        catch (err) {
                                            console.error('Failed to fetch serial_number for device', device.device_id, err);
                                        }
                                        yield db_1.default.query('INSERT INTO location_log (device_id, serial_number, latitude, longitude, timestamp, street_name, city_name, place_name, context_tag) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)', [device.device_id, serial_number, payload.latitude, payload.longitude, payload.street_name, payload.city_name, payload.place_name, payload.context_tag]);
                                        console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via direct DB insert (socket+API failed)`);
                                    }
                                }
                            }
                            else {
                                try {
                                    yield postLocationToApi(port, payload);
                                    console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via API`);
                                }
                                catch (err) {
                                    // fallback: direct DB insert
                                    // Fetch serial_number for device
                                    let serial_number = null;
                                    try {
                                        const [rows] = yield db_1.default.query('SELECT serial_number FROM device WHERE device_id = ?', [device.device_id]);
                                        if (Array.isArray(rows) && rows.length > 0)
                                            serial_number = rows[0].serial_number;
                                    }
                                    catch (err) {
                                        console.error('Failed to fetch serial_number for device', device.device_id, err);
                                    }
                                    yield db_1.default.query('INSERT INTO location_log (device_id, serial_number, latitude, longitude, timestamp, street_name, city_name, place_name, context_tag) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)', [device.device_id, serial_number, payload.latitude, payload.longitude, payload.street_name, payload.city_name, payload.place_name, payload.context_tag]);
                                    console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via direct DB insert (API failed)`);
                                }
                            }
                        }
                    }
                    catch (err) {
                        console.error('Continuous simulation error:', err);
                    }
                }), 5000);
            }
        }
        catch (err) {
            console.error('Simulation error:', err);
        }
    });
}
exports.runSimulation = runSimulation;
// If run directly, execute simulation
if (require.main === module) {
    runSimulation().then(() => process.exit(0));
}
