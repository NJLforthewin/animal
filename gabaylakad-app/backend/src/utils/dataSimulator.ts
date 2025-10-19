import pool from '../../db/db';

// Helper: get a random int in range
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: get a random float in range
function randFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Insert a sample device if none exists
export async function insertDevice() {
  const [rows] = await pool.query('SELECT device_id FROM device LIMIT 1');
  if ((rows as any[]).length === 0) {
    await pool.query("INSERT INTO device (device_serial_number, model, owner_id) VALUES (?, ?, ?)", [
      'DEV-' + randInt(1000,9999), 'Model-X', 1
    ]);
    console.log('Inserted sample device');
  } else {
    console.log('Device already exists');
  }
}

// Insert random battery status
export async function insertBatteryStatus() {
  const [devices] = await pool.query('SELECT device_id FROM device');
  for (const device of devices as any[]) {
    const battery = randFloat(10, 100).toFixed(1);
    await pool.query('INSERT INTO battery_status (device_id, battery_level) VALUES (?, ?)', [device.device_id, battery]);
    console.log(`Inserted battery status for device ${device.device_id}: ${battery}%`);
  }
}

// Insert random location
export async function insertLocationLog() {
  const [devices] = await pool.query('SELECT device_id FROM device');
  for (const device of devices as any[]) {
    const lat = randFloat(14.5, 14.7);
    const lng = randFloat(120.9, 121.1);
    await pool.query('INSERT INTO location_log (device_id, latitude, longitude, timestamp) VALUES (?, ?, ?, NOW())', [device.device_id, lat, lng]);
    console.log(`Inserted location for device ${device.device_id}: (${lat}, ${lng})`);
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
  for (const device of devices as any[]) {
    await pool.query(
      'INSERT INTO alert (device_id, user_id, alert_type, alert_description, created_at) VALUES (?, ?, ?, ?, NOW())',
      [device.device_id, 1, 'Emergency', 'Emergency button pressed']
    );
    console.log(`Inserted alert for device ${device.device_id}: Emergency button pressed`);
  }
}

// Insert random activity log
export async function insertActivityLog() {
  const [devices] = await pool.query('SELECT device_id FROM device');
  const events = ['walking', 'idle', 'charging', 'error'];
  for (const device of devices as any[]) {
    const event = events[randInt(0, events.length-1)];
    const payload = JSON.stringify({ event, steps: randInt(0, 5000), timestamp: new Date().toISOString() });
    await pool.query('INSERT INTO activity_log (device_id, event_type, payload, timestamp) VALUES (?, ?, ?, NOW())', [device.device_id, event, payload]);
    console.log(`Inserted activity log for device ${device.device_id}: ${event}`);
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
    console.log('IoT data simulation complete.');
  } catch (err) {
    console.error('Simulation error:', err);
  }
}

// If run directly, execute simulation
if (require.main === module) {
  runSimulation().then(() => process.exit(0));
}
