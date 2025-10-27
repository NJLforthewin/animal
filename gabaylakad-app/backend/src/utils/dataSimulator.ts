import pool from '../../db/db';
import http from 'http';
import { reverseGeocodeNominatim } from './reverseGeocode';
// socket client is optional and only required when emitting directly
let ioClient: any = null;
try {
  // lazy require to avoid adding dependency unless used
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ioClient = require('socket.io-client');
} catch (err) {
  ioClient = null;
}

// Helper: get a random int in range
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: get a random float in range
function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Cebu bounding box
const CEBU = {
  latMin: 10.2800,
  latMax: 10.3700,
  lonMin: 123.8600,
  lonMax: 123.9400
};

function clamp(v: number, a: number, b: number) {
  return Math.max(a, Math.min(b, v));
}

function metersToLatDeg(m: number) {
  return m / 111320; // approximate meters per degree latitude
}

function metersToLonDeg(m: number, lat: number) {
  const latRad = lat * (Math.PI / 180);
  return m / (111320 * Math.cos(latRad));
}

function postLocationToApi(port: number, payload: any) {
  return new Promise<void>((resolve, reject) => {
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
    const req = http.request(options, (res) => {
      // consume response
      res.on('data', () => {});
      res.on('end', () => resolve());
    });
    req.on('error', (err) => reject(err));
    req.write(data);
    req.end();
  });
}

function emitLocationToSocket(backendUrl: string, payload: any) {
  return new Promise<void>((resolve, reject) => {
    if (!ioClient) return reject(new Error('socket.io-client not available'));
    try {
      const socket = ioClient(backendUrl, { transports: ['websocket'] });
      socket.on('connect', () => {
        socket.emit('location_update', payload);
        socket.disconnect();
        resolve();
      });
      // timeout in case connect never happens
      setTimeout(() => {
        try { socket.disconnect(); } catch (e) {}
        reject(new Error('socket connect timeout'));
      }, 3000);
    } catch (err) {
      reject(err);
    }
  });
}

// Insert a sample device if none exists
export async function insertDevice() {
  const [rows] = await pool.query('SELECT device_id FROM device LIMIT 1');
  if ((rows as any[]).length === 0) {
    await pool.query("INSERT INTO device (serial_number) VALUES (?)", [
      'DEV-' + randInt(1000,9999)
    ]);
    console.log('Inserted sample device');
  } else {
    console.log('Device already exists');
  }
}

// Insert random battery status
export async function insertBatteryStatus() {
  const [devices] = await pool.query('SELECT device_id, serial_number FROM device');
  for (const device of devices as any[]) {
    // Device-specific battery offset for uniqueness
    const offset = (device.device_id % 13) * 2.5;
    const battery = (randFloat(10, 100 - offset) + offset).toFixed(1);
    await pool.query('INSERT INTO battery_status (device_id, battery_level) VALUES (?, ?)', [device.device_id, battery]);
    console.log(`Inserted battery status for device ${device.device_id}: ${battery}%`);
  }
}

// Insert random location
export async function insertLocationLog() {
  const [devices] = await pool.query('SELECT device_id FROM device');
  for (const device of devices as any[]) {
    let valid = false;
  let lat = 0, lng = 0;
  let geo: any = null;
  let poi: any = null;
    // Device-specific offset for location uniqueness
    const latOffset = ((device.device_id % 17) * 0.0015) + randFloat(0, 0.002);
    const lngOffset = ((device.device_id % 19) * 0.0012) + randFloat(0, 0.002);
    while (!valid) {
      lat = clamp(randFloat(CEBU.latMin, CEBU.latMax) + latOffset, CEBU.latMin, CEBU.latMax);
      lng = clamp(randFloat(CEBU.lonMin, CEBU.lonMax) + lngOffset, CEBU.lonMin, CEBU.lonMax);
      geo = await reverseGeocodeNominatim(lat, lng);
      if (geo && geo.city_name && geo.city_name.toLowerCase().includes('cebu city')) {
        valid = true;
      }
    }
    if (geo && geo.street_name && geo.place_name) {
      // Always call findNearestPOI and log the result
      const { findNearestPOI } = require('./reverseGeocode');
      poi = await findNearestPOI(lat, lng, 2000);
      if (!poi) {
        poi = await findNearestPOI(lat, lng, 20000);
      }
      if (poi) {
        console.log(`[Simulator POI] device ${device.device_id}: POI: ${poi.poi_name}, type: ${poi.poi_type}, distance: ${poi.poi_distance_m}m (${poi.poi_distance_km.toFixed(2)}km)`);
      } else {
        console.log(`[Simulator POI] device ${device.device_id}: No POI found within 20km.`);
      }
      await pool.query(
        `INSERT INTO location_log (
          device_id, serial_number, latitude, longitude, altitude, speed, heading, accuracy, signal_strength,
          timestamp, street_name, city_name, place_name, context_tag,
          poi_name, poi_type, poi_distance_m, poi_distance_km, poi_lat, poi_lon, poi_distance
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          device.device_id,
          device.serial_number ?? null,
          lat,
          lng,
          geo.altitude ?? null,
          geo.speed ?? null,
          geo.heading ?? null,
          geo.accuracy ?? null,
          geo.signal_strength ?? null,
          geo.street_name ?? null,
          geo.city_name ?? null,
          geo.place_name ?? null,
          geo.context_tag ?? null,
          poi?.poi_name ?? null,
          poi?.poi_type ?? null,
          poi?.poi_distance_m ?? null,
          poi?.poi_distance_km ?? null,
          poi?.poi_lat ?? null,
          poi?.poi_lon ?? null,
          poi?.poi_distance_km ?? null
        ]
      );
      console.log(`Inserted location for device ${device.device_id}: (${lat.toFixed(6)}, ${lng.toFixed(6)}) with context: ${geo.street_name}, ${geo.place_name}, ${geo.context_tag}, POI: ${poi?.poi_name}`);
    } else {
      console.log(`[Simulator] Skipped location insert for device ${device.device_id}: missing street_name or place_name.`);
    }
  }
}

// Insert random night reflector status
export async function insertNightReflectorStatus() {
  const [devices] = await pool.query('SELECT device_id FROM device');
  for (const device of devices as any[]) {
    const status = Math.random() > 0.5 ? 'on' : 'off';
    await pool.query('INSERT INTO night_reflector_status (device_id, status, timestamp) VALUES (?, ?, NOW())', [device.device_id, status]);
    console.log(`Inserted night reflector status for device ${device.device_id}: ${status}`);
  }
}

// Insert random alert
export async function insertAlert() {
  const [devices] = await pool.query('SELECT device_id FROM device');
  // Get all user_ids
  const [users] = await pool.query('SELECT user_id FROM user');
  const userIds = (users as any[]).map(u => u.user_id);
  for (const device of devices as any[]) {
    // Pick a random user_id for each alert
    const userId = userIds.length > 0 ? userIds[randInt(0, userIds.length - 1)] : null;
    if (userId) {
      await pool.query(
        'INSERT INTO alert (device_id, user_id, alert_type, alert_description, trigger_type, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [device.device_id, userId, 'Emergency', 'Emergency button pressed', 'button']
      );
      console.log(`Inserted alert for device ${device.device_id}: Emergency button pressed for user ${userId} (trigger: button)`);
    } else {
      console.log('No users found, skipping alert insert.');
    }
  }
}

// Insert realistic smart cane sensor events
export async function insertActivityLog() {
  const [devices] = await pool.query('SELECT device_id FROM device');
  const directions = ['left', 'right', 'front', 'back'];
  const buttons = ['SOS', 'mode', 'power'];
  for (const device of devices as any[]) {
    // Randomly pick an event type (sensor + non-sensor)
    const eventTypes = [
      'obstacle', 'button_press', 'vibration', 'gsm_status',
      'walking', 'idle', 'error'
    ];
    const eventType = eventTypes[randInt(0, eventTypes.length - 1)];
    let payload: any = { timestamp: new Date().toISOString() };
    switch (eventType) {
      case 'obstacle':
        payload = {
          event: 'obstacle',
          distance: randInt(30, 200), // cm
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
          speed: randInt(1, 5), // km/h
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
    await pool.query(
      'INSERT INTO activity_log (device_id, event_type, payload, timestamp) VALUES (?, ?, ?, NOW())',
      [device.device_id, eventType, JSON.stringify(payload)]
    );
    // Update device_status table for real-time status
    let statusUpdate: any = {};
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
      await pool.query(
        `INSERT INTO device_status (device_id, ${Object.keys(statusUpdate).join(', ')}) VALUES (?, ${Object.keys(statusUpdate).map(_ => '?').join(', ')})
        ON DUPLICATE KEY UPDATE ${columns}, updated_at = CURRENT_TIMESTAMP`,
        [device.device_id, ...values, ...values]
      );
      console.log(`Updated device_status for device ${device.device_id}:`, statusUpdate);
    }
    console.log(`Inserted activity log for device ${device.device_id}: ${eventType}`);
  }
}

// Main simulation runner
export async function runSimulation() {
  try {
    await insertDevice();
    await insertBatteryStatus();
    await insertLocationLog();
    await insertNightReflectorStatus();
    await insertAlert();
    await insertActivityLog();
    console.log('Initial IoT data simulation complete.');

    // Start continuous realistic movement simulation per device if requested
  const continuous = process.argv.includes('--continuous') || process.env.SIMULATE_CONTINUOUS === '1';
  const port = process.env.PORT ? Number(process.env.PORT) : 5000;
  const emitMode = process.argv.includes('--emit-socket') ? 'socket' : process.argv.includes('--emit-api') ? 'api' : process.env.SIMULATE_EMIT_MODE || 'api';
  const backendUrl = process.env.SIMULATOR_BACKEND_URL || `http://localhost:${port}`;
    if (continuous) {
      console.log('Starting continuous movement simulation (Cebu-bounded)');
      setInterval(async () => {
        try {
          const [devicesList] = await pool.query('SELECT device_id, serial_number FROM device');
          for (const device of devicesList as any[]) {
            // get last known location
            const [rows] = await pool.query('SELECT latitude, longitude FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1', [device.device_id]);
            let lat = rows && (rows as any[])[0] ? Number((rows as any[])[0].latitude) : randFloat(CEBU.latMin, CEBU.latMax);
            let lng = rows && (rows as any[])[0] ? Number((rows as any[])[0].longitude) : randFloat(CEBU.lonMin, CEBU.lonMax);

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
              geo = await reverseGeocodeNominatim(tryLat, tryLng);
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
                await emitLocationToSocket(backendUrl, payload);
                console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via SOCKET`);
              } catch (err) {
                // fallback to API then DB
                try {
                  await postLocationToApi(port, payload);
                  console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via API (socket failed)`);
                } catch (err2) {
                  // Fetch serial_number for device
                  let serial_number = null;
                  try {
                    const [rows]: [any[], any] = await pool.query('SELECT serial_number FROM device WHERE device_id = ?', [device.device_id]);
                    if (Array.isArray(rows) && rows.length > 0) serial_number = rows[0].serial_number;
                  } catch (err) {
                    console.error('Failed to fetch serial_number for device', device.device_id, err);
                  }
                  await pool.query(
                    'INSERT INTO location_log (device_id, serial_number, latitude, longitude, timestamp, street_name, city_name, place_name, context_tag) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)',
                    [device.device_id, serial_number, payload.latitude, payload.longitude, payload.street_name, payload.city_name, payload.place_name, payload.context_tag]
                  );
                  console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via direct DB insert (socket+API failed)`);
                }
              }
            } else {
              try {
                await postLocationToApi(port, payload);
                console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via API`);
              } catch (err) {
                // fallback: direct DB insert
                // Fetch serial_number for device
                let serial_number = null;
                try {
                  const [rows]: [any[], any] = await pool.query('SELECT serial_number FROM device WHERE device_id = ?', [device.device_id]);
                  if (Array.isArray(rows) && rows.length > 0) serial_number = rows[0].serial_number;
                } catch (err) {
                  console.error('Failed to fetch serial_number for device', device.device_id, err);
                }
                await pool.query(
                  'INSERT INTO location_log (device_id, serial_number, latitude, longitude, timestamp, street_name, city_name, place_name, context_tag) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)',
                  [device.device_id, serial_number, payload.latitude, payload.longitude, payload.street_name, payload.city_name, payload.place_name, payload.context_tag]
                );
                console.log(`Simulated move for device ${device.device_id}: (${payload.latitude}, ${payload.longitude}) via direct DB insert (API failed)`);
              }
            }
          }
        } catch (err) {
          console.error('Continuous simulation error:', err);
        }
      }, 5000);
    }
  } catch (err) {
    console.error('Simulation error:', err);
  }
}

// If run directly, execute simulation
if (require.main === module) {
  runSimulation().then(() => process.exit(0));
}
