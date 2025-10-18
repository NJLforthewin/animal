// Node.js script to initialize MySQL database and show tables
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('./db.config');

async function runSchema() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    const connection = await mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.password,
        multipleStatements: true
    });
    try {
        await connection.query(schemaSQL);
        console.log('Database and tables created or verified.');
        await connection.changeUser({database: config.database});
        const [tables] = await connection.query('SHOW TABLES');
        console.log('Tables in', config.database + ':');
        tables.forEach(row => {
            console.log('- ' + Object.values(row)[0]);
        });

        // Insert default devices if not present
        const [existingDevices] = await connection.query('SELECT COUNT(*) as count FROM device');
        if (existingDevices[0].count < 50) {
            const deviceInserts = [];
            for (let i = 1; i <= 50; i++) {
                const serial = 'GL' + i.toString().padStart(3, '0');
                deviceInserts.push([serial, 1]);
            }
            // Insert only devices that do not already exist
            for (const [serial, isActive] of deviceInserts) {
                await connection.query('INSERT IGNORE INTO device (serial_number, is_active) VALUES (?, ?)', [serial, isActive]);
            }
            console.log('Default devices ensured in device table.');
        } else {
            console.log('Device table already has 50 or more devices. Skipping default insert.');
        }
    } catch (err) {
        console.error('Error running schema:', err.message || err);
    } finally {
        await connection.end();
    }
}

runSchema();
