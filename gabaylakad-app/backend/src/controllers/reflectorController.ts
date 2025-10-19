import { Request, Response } from 'express';
import pool from '../../db/db';
import { ResultSetHeader } from 'mysql2';

// TODO: integrate with IoT device data stream

export const getAllReflectors = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM reflector');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const getReflectorById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM reflector WHERE reflector_id = ?', [id]);
        const reflectors = rows as any[];
        if (reflectors.length === 0) return res.status(404).json({ message: 'Reflector not found' });
        res.json(reflectors[0]);
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const createReflector = async (req: Request, res: Response) => {
    try {
        const reflector = req.body;
        const [result] = await pool.query('INSERT INTO reflector SET ?', [reflector]);
        const insertResult = result as ResultSetHeader;
        res.status(201).json({ reflector_id: insertResult.insertId, ...reflector });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const updateReflector = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const reflector = req.body;
        const [result] = await pool.query('UPDATE reflector SET ? WHERE reflector_id = ?', [reflector, id]);
        const updateResult = result as ResultSetHeader;
        if (updateResult.affectedRows === 0) return res.status(404).json({ message: 'Reflector not found' });
        res.json({ reflector_id: id, ...reflector });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};

export const deleteReflector = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM reflector WHERE reflector_id = ?', [id]);
        const deleteResult = result as ResultSetHeader;
        if (deleteResult.affectedRows === 0) return res.status(404).json({ message: 'Reflector not found' });
        res.json({ message: 'Reflector deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Database error', error });
    }
};
