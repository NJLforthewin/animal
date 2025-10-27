
import { Request, Response } from 'express';
import pool from '../../db/db';
import { ResultSetHeader } from 'mysql2';

// Get device by serial number
export const getDeviceBySerial = async (req: Request, res: Response) => {
    console.log(`[DEVICE] getDeviceBySerial called by user: ${req.user?.userId}, serial: ${req.params.serial_number}`);
    try {
        const { serial_number } = req.params;
        const [rows] = await pool.query('SELECT * FROM device WHERE serial_number = ?', [serial_number]);
        const devices = rows as any[];
        if (devices.length === 0) return res.status(404).json({ message: 'Device not found' });
        res.json(devices[0]);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

// TODO: integrate with IoT device data stream

export const getAllDevices = async (req: Request, res: Response) => {
    console.log(`[DEVICE] getAllDevices called by user: ${req.user?.userId}`);
    try {
        const [rows] = await pool.query('SELECT * FROM device');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
            const [rows] = await pool.query('SELECT * FROM device WHERE user_id = ?', [userId]);
            res.json(rows);
        } catch (error) {
            res.status(500).json({ message: 'Database error', error });
        }
};

export const getDeviceById = async (req: Request, res: Response) => {
    console.log(`[DEVICE] getDeviceById called by user: ${req.user?.userId}, deviceId: ${req.params.id}`);
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM device WHERE device_id = ?', [id]);
        const devices = rows as any[];
        if (devices.length === 0) return res.status(404).json({ message: 'Device not found' });
        res.json(devices[0]);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
            const { id } = req.params;
            const [rows] = await pool.query('SELECT * FROM device WHERE device_id = ? AND user_id = ?', [id, userId]);
            const devices = rows as any[];
            if (devices.length === 0) return res.status(404).json({ message: 'Device not found' });
            res.json(devices[0]);
        } catch (error) {
            res.status(500).json({ message: 'Database error', error });
        }
};

export const createDevice = async (req: Request, res: Response) => {
    console.log(`[DEVICE] createDevice called by user: ${req.user?.userId}`);
    try {
        const device = req.body;
        const [result] = await pool.query('INSERT INTO device SET ?', [device]);
        const insertResult = result as ResultSetHeader;
        res.status(201).json({ device_id: insertResult.insertId, ...device });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
            const device = { ...req.body, user_id: userId };
            const [result] = await pool.query('INSERT INTO device SET ?', [device]);
            const insertResult = result as ResultSetHeader;
            res.status(201).json({ device_id: insertResult.insertId, ...device });
        } catch (error) {
            res.status(500).json({ message: 'Database error', error });
        }
};

export const updateDevice = async (req: Request, res: Response) => {
    console.log(`[DEVICE] updateDevice called by user: ${req.user?.userId}, deviceId: ${req.params.id}`);
    try {
        const { id } = req.params;
        const device = req.body;
        const [result] = await pool.query('UPDATE device SET ? WHERE device_id = ?', [device, id]);
        const updateResult = result as ResultSetHeader;
        if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Device not found' });
        res.json({ device_id: id, ...device });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
        try {
            const userId = req.user?.userId;
            if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
            const { id } = req.params;
            const device = req.body;
            const [result] = await pool.query('UPDATE device SET ? WHERE device_id = ? AND user_id = ?', [device, id, userId]);
            const updateResult = result as ResultSetHeader;
            if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Device not found' });
            res.json({ device_id: id, ...device });
        } catch (error) {
            res.status(500).json({ message: 'Database error', error });
        }
};

export const deleteDevice = async (req: Request, res: Response) => {
    console.log(`[DEVICE] deleteDevice called by user: ${req.user?.userId}, deviceId: ${req.params.id}`);
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM device WHERE device_id = ? AND user_id = ?', [id, userId]);
        const deleteResult = result as ResultSetHeader;
        if (deleteResult.affectedRows === 0) return res.status(404).json({ message: 'Device not found' });
        res.json({ device_id: id, message: 'Device deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};
