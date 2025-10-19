// --- Dashboard Card Endpoints ---

// TypeScript interfaces for endpoint responses
export interface EmergencyAlert {
    device_id: number;
    serial_number: string;
    alert_id: number | null;
    alert_type: string | null;
    alert_description: string | null;
    created_at: string | null;
}

export interface ActivityLog {
    device_id: number;
    serial_number: string;
    activity_id: number | null;
    activity_type: string | null;
    timestamp: string | null;
}

export interface NightReflectorStatus {
    device_id: number;
    serial_number: string;
    status_id: number | null;
    status: string | null;
    updated_at: string | null;
}

export interface DeviceLocation {
    device_id: number;
    serial_number: string;
    location_id: number | null;
    latitude: number | null;
    longitude: number | null;
    timestamp: string | null;
}
export const getEmergencyStatus = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
            SELECT d.device_id AS device_id, d.serial_number, a.alert_id AS alert_id, a.alert_type, a.alert_description, a.created_at
            FROM device d
            LEFT JOIN (
                SELECT alert.* FROM alert
                INNER JOIN (
                    SELECT device_id, MAX(created_at) AS max_created FROM alert WHERE alert_type = 'emergency' GROUP BY device_id
                ) latest ON alert.device_id = latest.device_id AND alert.created_at = latest.max_created AND alert.alert_type = 'emergency'
            ) a ON d.device_id = a.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch emergency status', error: error instanceof Error ? error.message : error });
    }
};

export const getNightReflectorStatus = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
            SELECT d.device_id AS device_id, d.serial_number, nrs.reflector_id AS status_id, nrs.status, nrs.timestamp
            FROM device d
            LEFT JOIN (
                SELECT nrs1.* FROM night_reflector_status nrs1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM night_reflector_status GROUP BY device_id
                ) latest ON nrs1.device_id = latest.device_id AND nrs1.timestamp = latest.max_ts
            ) nrs ON d.device_id = nrs.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch night reflector status', error: error instanceof Error ? error.message : error });
    }
};

export const getActivityLog = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
            SELECT d.device_id AS device_id, d.serial_number, al.id AS activity_id, al.event_type AS activity_type, al.timestamp
            FROM device d
            LEFT JOIN (
                SELECT al1.* FROM activity_log al1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM activity_log GROUP BY device_id
                ) latest ON al1.device_id = latest.device_id AND al1.timestamp = latest.max_ts
            ) al ON d.device_id = al.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity log', error: error instanceof Error ? error.message : error });
    }
};

export const getLocationData = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
            SELECT d.device_id AS device_id, d.serial_number, ll.log_id AS location_id, ll.latitude, ll.longitude, ll.timestamp
            FROM device d
            LEFT JOIN (
                SELECT ll1.* FROM location_log ll1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM location_log GROUP BY device_id
                ) latest ON ll1.device_id = latest.device_id AND ll1.timestamp = latest.max_ts
            ) ll ON d.device_id = ll.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch location data', error: error instanceof Error ? error.message : error });
    }
};
import pool from '../../db/db';
import { Request, Response } from 'express';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM dashboard_latest ORDER BY device_id ASC');
        res.status(200).json(rows);
    } catch (error) {
        console.error('[Dashboard SQL Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getDeviceStatus = async (req: Request, res: Response) => {
    res.status(200).json([]); // TODO: Implement real device status aggregation
};

export const getBatteryLevels = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM dashboard_battery_latest ORDER BY device_id ASC');
        res.status(200).json({ data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch battery levels', error: error instanceof Error ? error.message : error });
    }
};

export const getRecentAlerts = async (req: Request, res: Response) => {
    res.status(200).json([]); // TODO: Implement real alert aggregation
};

export const getReflectorStatus = async (req: Request, res: Response) => {
    res.status(200).json([]); // TODO: Implement real reflector status aggregation
};

export const getActivitySummary = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM dashboard_activity_latest ORDER BY device_id ASC');
        res.status(200).json({ data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity summary', error: error instanceof Error ? error.message : error });
    }
};
