import { Request, Response } from 'express';
import pool from '../../db/db';
import { ResultSetHeader } from 'mysql2';

// TODO: integrate with IoT device data stream

export const getAllBatteries = async (req: Request, res: Response) => {
    console.log(`[BATTERY] getAllBatteries called by user: ${req.user?.userId}`);
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const [rows] = await pool.query('SELECT * FROM battery WHERE user_id = ?', [userId]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const getBatteryById = async (req: Request, res: Response) => {
    console.log(`[BATTERY] getBatteryById called by user: ${req.user?.userId}, batteryId: ${req.params.id}`);
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM battery WHERE battery_id = ? AND user_id = ?', [id, userId]);
        const batteries = rows as any[];
        if (batteries.length === 0) return res.status(404).json({ message: 'Battery not found' });
        res.json(batteries[0]);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const createBattery = async (req: Request, res: Response) => {
    console.log(`[BATTERY] createBattery called by user: ${req.user?.userId}`);
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const battery = { ...req.body, user_id: userId };
        const [result] = await pool.query('INSERT INTO battery SET ?', [battery]);
        const insertResult = result as ResultSetHeader;
        res.status(201).json({ battery_id: insertResult.insertId, ...battery });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const updateBattery = async (req: Request, res: Response) => {
    console.log(`[BATTERY] updateBattery called by user: ${req.user?.userId}, batteryId: ${req.params.id}`);
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const battery = req.body;
        const [result] = await pool.query('UPDATE battery SET ? WHERE battery_id = ? AND user_id = ?', [battery, id, userId]);
        const updateResult = result as ResultSetHeader;
        if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Battery not found' });
        res.json({ battery_id: id, ...battery });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const deleteBattery = async (req: Request, res: Response) => {
    console.log(`[BATTERY] deleteBattery called by user: ${req.user?.userId}, batteryId: ${req.params.id}`);
    try {
        const userId = req.user?.userId;
        if (!userId) return res.status(401).json({ message: 'Unauthorized: No userId in token' });
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM battery WHERE battery_id = ? AND user_id = ?', [id, userId]);
        const deleteResult = result as ResultSetHeader;
        if (deleteResult.affectedRows === 0) return res.status(404).json({ message: 'Battery not found' });
        res.json({ message: 'Battery deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};
