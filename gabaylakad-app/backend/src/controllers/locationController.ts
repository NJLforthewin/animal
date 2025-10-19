import { Request, Response } from 'express';
import pool from '../../db/db';
import { ResultSetHeader } from 'mysql2';

// TODO: integrate with IoT device data stream

export const getAllLocations = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM location');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const getLocationById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM location WHERE location_id = ?', [id]);
        const locations = rows as any[];
        if (locations.length === 0) return res.status(404).json({ message: 'Location not found' });
        res.json(locations[0]);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const createLocation = async (req: Request, res: Response) => {
    try {
        const location = req.body;
        const [result] = await pool.query('INSERT INTO location SET ?', [location]);
        const insertResult = result as ResultSetHeader;
        res.status(201).json({ location_id: insertResult.insertId, ...location });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const updateLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const location = req.body;
        const [result] = await pool.query('UPDATE location SET ? WHERE location_id = ?', [location, id]);
        const updateResult = result as ResultSetHeader;
        if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Location not found' });
        res.json({ location_id: id, ...location });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const deleteLocation = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM location WHERE location_id = ?', [id]);
        const deleteResult = result as ResultSetHeader;
        if (deleteResult.affectedRows === 0) return res.status(404).json({ message: 'Location not found' });
        res.json({ message: 'Location deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};
