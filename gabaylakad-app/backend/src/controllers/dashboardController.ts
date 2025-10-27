// Fetch real-time device status from device_status table
import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../../db/db';

export const getDeviceStatus = async (req: Request, res: Response) => {
    let deviceId = req.params.id;
    // If no deviceId param, use authenticated user's device
    if (!deviceId && req.user?.userId) {
        // Query user's device_id
        const [userRows] = await pool.query('SELECT device_id FROM user WHERE user_id = ?', [req.user.userId]);
        const userRowArr = userRows as RowDataPacket[];
        if (userRowArr.length > 0 && userRowArr[0].device_id) {
            deviceId = userRowArr[0].device_id;
        }
    }
    if (!deviceId) {
        return res.status(400).json({ success: false, message: 'No device ID found for user.' });
    }
    try {
        const [rows] = await pool.query(
            `SELECT * FROM device_status WHERE device_id = ?`,
            [deviceId]
        );
        if (Array.isArray(rows) && rows.length > 0) {
            res.status(200).json({ success: true, data: rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'No status found for device.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch device status', error: error instanceof Error ? error.message : error });
    }
};
// Fetch recent sensor events from activity_log for dashboard sensor card

export const getSensorLog = async (req: Request, res: Response) => {
    try {
        // Fetch the latest 20 sensor events (can adjust as needed)
        const [rows] = await pool.query(`
            SELECT al.id, al.device_id, d.serial_number, al.event_type, al.payload, al.timestamp
            FROM activity_log al
            JOIN device d ON al.device_id = d.device_id
            ORDER BY al.timestamp DESC
            LIMIT 20
        `);
        // Parse payload JSON and flatten for frontend
        const data = (rows as RowDataPacket[]).map(row => {
            let payload = {};
            try {
                payload = row.payload ? JSON.parse(row.payload) : {};
            } catch (e) {
                payload = {};
            }
            return {
                id: row.id,
                device_id: row.device_id,
                serial_number: row.serial_number,
                event_type: row.event_type,
                ...payload,
                timestamp: row.timestamp
            };
        });
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch sensor log', error: error instanceof Error ? error.message : error });
    }
};
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
            SELECT d.device_id AS device_id, d.serial_number, a.alert_id AS alert_id, a.alert_type, a.alert_description, a.created_at,
                   a.trigger_type
            FROM device d
            LEFT JOIN (
                SELECT alert.* FROM alert
                INNER JOIN (
                    SELECT device_id, MAX(created_at) AS max_created FROM alert WHERE alert_type = 'emergency' GROUP BY device_id
                ) latest ON alert.device_id = latest.device_id AND alert.created_at = latest.max_created AND alert.alert_type = 'emergency'
            ) a ON d.device_id = a.device_id
            ORDER BY d.device_id ASC
        `);
        // Ensure trigger_type is always present in the response
        const mappedRows = (rows as any[]).map(row => ({
            ...row,
            trigger_type: row.trigger_type !== undefined ? row.trigger_type : null
        }));
        res.status(200).json({ success: true, data: mappedRows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch emergency status', error: error instanceof Error ? error.message : error });
    }
};

export const getNightReflectorStatus = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query(`
            SELECT n.device_id, d.serial_number, n.status, n.timestamp AS last_checked
            FROM night_reflector_status n
            JOIN device d ON n.device_id = d.device_id
            WHERE n.timestamp = (
                SELECT MAX(timestamp) FROM night_reflector_status WHERE device_id = n.device_id
            )
            ORDER BY n.device_id ASC
        `);
        // Ensure last_checked is always present in the response
        const mappedRows = (rows as any[]).map(row => ({
            ...row,
            last_checked: row.last_checked !== undefined ? row.last_checked : null
        }));
        res.status(200).json({ success: true, data: mappedRows });
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
                    SELECT device_id, MAX(timestamp) AS max_ts FROM activity_log al1
                    WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
                    GROUP BY device_id
                ) latest ON al1.device_id = latest.device_id AND al1.timestamp = latest.max_ts
                WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
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
            SELECT d.device_id AS device_id, d.serial_number, al.id AS activity_id, al.event_type AS activity_type, al.timestamp
            FROM device d
            LEFT JOIN (
                SELECT al1.* FROM activity_log al1
                INNER JOIN (
                    SELECT device_id, MAX(timestamp) AS max_ts FROM activity_log al1
                    WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
                    GROUP BY device_id
                ) latest ON al1.device_id = latest.device_id AND al1.timestamp = latest.max_ts
                WHERE al1.event_type NOT IN ('gsm_status', 'button_press', 'vibration', 'obstacle')
            ) al ON d.device_id = al.device_id
            ORDER BY d.device_id ASC
        `);
        res.status(200).json({ data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch activity summary', error: error instanceof Error ? error.message : error });
    }
}
