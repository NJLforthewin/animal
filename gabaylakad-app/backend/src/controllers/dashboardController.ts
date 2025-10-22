// Get dashboard device info by serial number
export const getDashboardDeviceBySerial = async (req: Request, res: Response) => {
    const serialNumber = req.params.serial_number;
    try {
        const [rows] = await pool.query(
            `SELECT * FROM dashboard_latest WHERE serial_number = ? LIMIT 1`,
            [serialNumber]
        );
        const result = rows as any[];
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        const device = result[0];
        res.status(200).json({
            ...device,
            street_name: device.street_name ?? null,
            place_name: device.place_name ?? null,
            context_tag: device.context_tag ?? null,
            city_name: device.city_name ?? null
        });
    } catch (error) {
        console.error('[Dashboard Device Serial Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
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
            SELECT n.device_id, d.serial_number, n.status, n.timestamp
            FROM night_reflector_status n
            JOIN device d ON n.device_id = d.device_id
            WHERE n.timestamp = (
                SELECT MAX(timestamp) FROM night_reflector_status WHERE device_id = n.device_id
            )
            ORDER BY n.device_id ASC
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
            SELECT l.device_id, d.serial_number, l.latitude, l.longitude, l.timestamp,
                   l.street_name, l.city_name, l.place_name, l.context_tag
            FROM location_log l
            JOIN device d ON l.device_id = d.device_id
            WHERE l.timestamp = (
                SELECT MAX(timestamp) FROM location_log WHERE device_id = l.device_id
            )
            ORDER BY l.device_id ASC
        `);
        const mappedRows = (rows as any[]).map((row: any) => ({
            ...row,
            street_name: row.street_name ?? null,
            city_name: row.city_name ?? null,
            place_name: row.place_name ?? null,
            context_tag: row.context_tag ?? null
        }));
        res.status(200).json({ success: true, data: mappedRows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch location data', error: error instanceof Error ? error.message : error });
    }
};

import pool from '../../db/db';
import { Request, Response } from 'express';

// Device Info Modal endpoint
export const getDeviceInfo = async (req: Request, res: Response) => {
    const deviceId = req.params.id;
    try {
        const [rows] = await pool.query(
            `SELECT * FROM dashboard_latest WHERE device_id = ? LIMIT 1`,
            [deviceId]
        );
        const result = rows as any[];
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'Device not found' });
        }
        // Explicitly include contextual fields in response
        const device = result[0];
        res.status(200).json({
            ...device,
            street_name: device.street_name ?? null,
            place_name: device.place_name ?? null,
            context_tag: device.context_tag ?? null,
            city_name: device.city_name ?? null
        });
    } catch (error) {
        console.error('[Device Info Error]', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

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
    const [rows] = await pool.query(`
      SELECT b.device_id, d.serial_number, b.battery_level, b.timestamp
      FROM battery_status b
      JOIN device d ON b.device_id = d.device_id
      WHERE b.timestamp = (
        SELECT MAX(timestamp) FROM battery_status WHERE device_id = b.device_id
      )
      ORDER BY b.device_id ASC
    `);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch battery levels', error: error instanceof Error ? error.message : error });
  }
}

export const getRecentAlerts = async (req: Request, res: Response) => {
    res.status(200).json([]); // TODO: Implement real alert aggregation
};

export const getReflectorStatus = async (req: Request, res: Response) => {
    res.status(200).json([]); // TODO: Implement real reflector status aggregation
};

export const getActivitySummary = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.device_id, d.serial_number, a.event_type, a.payload, a.timestamp
      FROM activity_log a
      JOIN device d ON a.device_id = d.device_id
      WHERE a.timestamp = (
        SELECT MAX(timestamp) FROM activity_log WHERE device_id = a.device_id
      )
      ORDER BY a.device_id ASC
    `);
    res.status(200).json({ data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch activity summary', error: error instanceof Error ? error.message : error });
  }
}
