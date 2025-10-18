// Simple script to test MySQL connection
const db = require('./db');

async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1 AS test');
        console.log('MySQL connection successful:', rows);
        process.exit(0);
    } catch (err) {
        console.error('MySQL connection failed:', err);
        process.exit(1);
    }
}

testConnection();
