import { Request, Response } from 'express';
import pool from '../../db/db';
import { ResultSetHeader } from 'mysql2';

// TODO: integrate with IoT device data stream

export const getAllAlerts = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM alert');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const getAlertById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM alert WHERE alert_id = ?', [id]);
        const alerts = rows as any[];
        if (alerts.length === 0) return res.status(404).json({ message: 'Alert not found' });
        res.json(alerts[0]);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const createAlert = async (req: Request, res: Response) => {
    try {
        const alert = req.body;
        const [result] = await pool.query('INSERT INTO alert SET ?', [alert]);
        const insertResult = result as ResultSetHeader;
        res.status(201).json({ alert_id: insertResult.insertId, ...alert });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const updateAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const alert = req.body;
        const [result] = await pool.query('UPDATE alert SET ? WHERE alert_id = ?', [alert, id]);
        const updateResult = result as ResultSetHeader;
        if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Alert not found' });
        res.json({ alert_id: id, ...alert });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const deleteAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM alert WHERE alert_id = ?', [id]);
        const deleteResult = result as ResultSetHeader;
        if (deleteResult.affectedRows === 0) return res.status(404).json({ message: 'Alert not found' });
        res.json({ message: 'Alert deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};
