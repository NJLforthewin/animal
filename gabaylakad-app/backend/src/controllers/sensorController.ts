import { Request, Response } from 'express';

export const getSensorData = async (req: Request, res: Response) => {
    console.log(`[SENSOR] getSensorData called by user: ${req.user?.userId}`);
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        // Look up device for authenticated user
        const pool = require('../../db/db').default;
        const [userRows]: [any[], any] = await pool.query('SELECT device_id FROM user WHERE user_id = ?', [userId]);
        if (!userRows || userRows.length === 0 || !userRows[0].device_id) {
            return res.status(404).json({ message: 'No device found for user' });
        }
        const deviceId = userRows[0].device_id;
        // Fetch sensor data for device (mocked for now)
        const sensorData = {
            device_id: deviceId,
            heart_rate: Math.floor(Math.random() * (100 - 60 + 1)) + 60,
            oxygen_level: Math.floor(Math.random() * (100 - 95 + 1)) + 95,
            timestamp: new Date().toISOString(),
        };
        res.json(sensorData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sensor data', error });
    }
};