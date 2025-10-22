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
            yield db_1.default.query("INSERT INTO device (device_serial_number, model, owner_id) VALUES (?, ?, ?)", [
                'DEV-' + randInt(1000, 9999), 'Model-X', 1
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
        const [devices] = yield db_1.default.query('SELECT device_id FROM device');
        for (const device of devices) {
            const battery = randFloat(10, 100).toFixed(1);
            yield db_1.default.query('INSERT INTO battery_status (device_id, battery_level) VALUES (?, ?)', [device.device_id, battery]);
            console.log(`Inserted battery status for device ${device.device_id}: ${battery}%`);
        }
    });
}
exports.insertBatteryStatus = insertBatteryStatus;
// Insert random location
function insertLocationLog() {
    return __awaiter(this, void 0, void 0, function* () {
        const [devices] = yield db_1.default.query('SELECT device_id FROM device');
        for (const device of devices) {
            // For initial insertion, pick a random point inside Cebu bounding box
            const lat = randFloat(CEBU.latMin, CEBU.latMax);
            const lng = randFloat(CEBU.lonMin, CEBU.lonMax);
            yield db_1.default.query('INSERT INTO location_log (device_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())', [device.device_id, lat, lng]);
            console.log(`Inserted location for device ${device.device_id}: (${lat.toFixed(6)}, ${lng.toFixed(6)})`);
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
        for (const device of devices) {
            yield db_1.default.query('INSERT INTO alert (device_id, user_id, alert_type, alert_description, created_at) VALUES (?, ?, ?, ?, NOW())', [device.device_id, 1, 'Emergency', 'Emergency button pressed']);
            console.log(`Inserted alert for device ${device.device_id}: Emergency button pressed`);
        }
    });
}
exports.insertAlert = insertAlert;
// Insert random activity log
function insertActivityLog() {
    return __awaiter(this, void 0, void 0, function* () {
        const [devices] = yield db_1.default.query('SELECT device_id FROM device');
        const events = ['walking', 'idle', 'charging', 'error'];
        for (const device of devices) {
            const event = events[randInt(0, events.length - 1)];
            const payload = JSON.stringify({ event, steps: randInt(0, 5000), timestamp: new Date().toISOString() });
            yield db_1.default.query('INSERT INTO activity_log (device_id, event_type, payload, timestamp) VALUES (?, ?, ?, NOW())', [device.device_id, event, payload]);
            console.log(`Inserted activity log for device ${device.device_id}: ${event}`);
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
                        const [devicesList] = yield db_1.default.query('SELECT device_id FROM device');
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
                            // add mock contextual fields for testing
                            const streets = ['Colon St', 'Osmeña Blvd', 'General Maxilom Ave', 'A. S. Fortuna St', 'M. Velez St'];
                            const places = ['Cebu Business Park', 'SM City Cebu', 'Ayala Center', 'Carbon Market', 'Fuente Osmeña'];
                            const contextTags = ['home', 'work', 'market', 'transit', 'other'];
                            const payload = {
                                device_id: device.device_id,
                                latitude: Number(newLat.toFixed(6)),
                                longitude: Number(newLng.toFixed(6)),
                                timestamp: new Date().toISOString(),
                                street_name: streets[Math.floor(Math.random() * streets.length)],
                                place_name: places[Math.floor(Math.random() * places.length)],
                                context_tag: contextTags[Math.floor(Math.random() * contextTags.length)]
                            };
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
                                        yield db_1.default.query('INSERT INTO location_log (device_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())', [device.device_id, payload.latitude, payload.longitude]);
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
                                    yield db_1.default.query('INSERT INTO location_log (device_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())', [device.device_id, payload.latitude, payload.longitude]);
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
