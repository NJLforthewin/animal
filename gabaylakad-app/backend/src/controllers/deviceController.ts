
import { Request, Response } from 'express';
import pool from '../../db/db';
import { ResultSetHeader } from 'mysql2';

// Get device by serial number
export const getDeviceBySerial = async (req: Request, res: Response) => {
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
    try {
        const [rows] = await pool.query('SELECT * FROM device');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const getDeviceById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM device WHERE device_id = ?', [id]);
        const devices = rows as any[];
        if (devices.length === 0) return res.status(404).json({ message: 'Device not found' });
        res.json(devices[0]);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const createDevice = async (req: Request, res: Response) => {
    try {
        const device = req.body;
        const [result] = await pool.query('INSERT INTO device SET ?', [device]);
        const insertResult = result as ResultSetHeader;
        res.status(201).json({ device_id: insertResult.insertId, ...device });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const updateDevice = async (req: Request, res: Response) => {
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
};

export const deleteDevice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM device WHERE device_id = ?', [id]);
        const deleteResult = result as ResultSetHeader;
        if (deleteResult.affectedRows === 0) return res.status(404).json({ message: 'Device not found' });
        res.json({ message: 'Device deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};
