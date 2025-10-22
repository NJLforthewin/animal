    export const getLocationHistoryBySerial = async (req: Request, res: Response) => {
    const { serial_number } = req.params;
    if (!serial_number) {
        return res.status(400).json({ success: false, message: 'Missing serial_number parameter' });
    }
    try {
        const sql = `SELECT * FROM location_log WHERE serial_number = ? ORDER BY timestamp DESC LIMIT 100`;
        const [rows] = await pool.query(sql, [serial_number]);
        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[LocationHistoryBySerial SQL Error]', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch location history by serial' });
    }
};
// SAFE MODE: Real-time Location History Endpoint
import { ResultSetHeader } from 'mysql2';
import { Request, Response } from 'express';
import pool from '../../db/db';
import { reverseGeocodeNominatim, findNearestPOI } from '../utils/reverseGeocode';

// Get latest device info including POI fields
export const getDeviceInfo = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    if (!deviceId) {
        return res.status(400).json({ message: 'Missing deviceId parameter' });
    }
    try {
        // Get latest location log for device
        const sql = `SELECT * FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1`;
        const [rows]: [any[], any] = await pool.query(sql, [deviceId]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No location found for device' });
        }
        // Return all fields including POI
        return res.json(rows[0]);
    } catch (error) {
        console.error('[getDeviceInfo Error]', error);
        return res.status(500).json({ message: 'Failed to fetch device info' });
    }
};
export const getLocationHistory = async (req: Request, res: Response) => {
    const { device_id } = req.params;
    if (!device_id) {
        return res.status(400).json({ success: false, message: 'Missing device_id parameter' });
    }
    try {
        const sql = `SELECT * FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 100`;
        const [rows] = await pool.query(sql, [device_id]);
        return res.json({ success: true, data: rows });
    } catch (error) {
        console.error('[LocationHistory SQL Error]', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch location history' });
    }
};

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
// Get latest device info including POI fields
const getDeviceInfo = async (req: Request, res: Response) => {
    const { deviceId } = req.params;
    if (!deviceId) {
        return res.status(400).json({ message: 'Missing deviceId parameter' });
    }
    try {
        // Get latest location log for device
        const sql = `SELECT * FROM location_log WHERE device_id = ? ORDER BY timestamp DESC LIMIT 1`;
        const [rows]: [any[], any] = await pool.query(sql, [deviceId]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'No location found for device' });
        }
        // Return all fields including POI
        return res.json(rows[0]);
    } catch (error) {
        console.error('[getDeviceInfo Error]', error);
        return res.status(500).json({ message: 'Failed to fetch device info' });
    }
};

    }
};

export const createLocation = async (req: Request, res: Response) => {
    try {
            // Accept and validate contextual fields for location tracking
            const {
                device_id,
                latitude,
                longitude,
                altitude,
                speed,
                heading,
                accuracy,
                signal_strength,
                street_name,
                city_name,
                place_name,
                context_tag,
                timestamp
            } = req.body;

            if (!device_id || latitude === undefined || longitude === undefined) {
                return res.status(400).json({ message: 'Missing required location fields' });
            }

            // Always fetch serial_number from device table using device_id
            let serial_number: string | null = null;
            try {
                const [deviceRows]: [any[], any] = await pool.query('SELECT serial_number FROM device WHERE device_id = ?', [device_id]);
                if (deviceRows && deviceRows.length > 0) {
                    serial_number = deviceRows[0].serial_number ?? null;
                } else {
                    serial_number = null;
                }
            } catch (err) {
                console.error('[SerialNumber Fetch Error]', err);
                serial_number = null;
        }

        // If any contextual field is missing, perform reverse geocoding
    let finalStreet = street_name;
    let finalCity = city_name;
    let finalPlace = place_name;
    let finalContext = context_tag;
        let poi_name = null, poi_type = null, poi_distance_km = null, poi_distance_m = null, poi_lat = null, poi_lon = null;
        let geo = null;
        if (!street_name || !city_name || !place_name || !context_tag) {
            geo = await reverseGeocodeNominatim(latitude, longitude);
            finalStreet = finalStreet || geo.street_name;
            finalCity = finalCity || geo.city_name;
            finalPlace = finalPlace || geo.place_name;
            finalContext = finalContext || geo.context_tag;
        }
        // Always set a default street name if missing
        if (!finalStreet) {
            finalStreet = 'Unknown Street';
        }
        // Always try to get POI info from reverse geocode (if not already done)
        if (!geo) geo = await reverseGeocodeNominatim(latitude, longitude);
        poi_name = geo.poi_name;
        poi_type = geo.poi_type;
        poi_distance_km = geo.poi_distance_km;
        poi_distance_m = geo.poi_distance_m;
        poi_lat = geo.poi_lat;
        poi_lon = geo.poi_lon;

        // If no POI found, use findNearestPOI to get the closest POI of any type within 2km, then 20km if still not found
        if (!poi_name && latitude && longitude) {
            let nearestPOI = await findNearestPOI(latitude, longitude, 2000);
            if (!nearestPOI) {
                // Try with a much larger radius (20km)
                nearestPOI = await findNearestPOI(latitude, longitude, 20000);
            }
            if (nearestPOI) {
                poi_name = nearestPOI.poi_name;
                poi_type = nearestPOI.poi_type;
                poi_distance_km = nearestPOI.poi_distance_km;
                poi_distance_m = nearestPOI.poi_distance_m;
                poi_lat = nearestPOI.poi_lat;
                poi_lon = nearestPOI.poi_lon;
            } else {
                // Fallback values if no POI found
                poi_name = 'No POI found nearby';
                poi_type = 'none';
                poi_distance_km = -1;
                poi_distance_m = -1;
                poi_lat = null;
                poi_lon = null;
                console.log('[POI Fallback] No POI found for lat:', latitude, 'lon:', longitude);
            }
        }
        // Log POI fields for debugging (after assignment, inside correct scope)
        console.log('[POI Debug]', {
            poi_name: poi_name ?? null,
            poi_type: poi_type ?? null,
            poi_distance_km: poi_distance_km ?? null,
            poi_distance_m: poi_distance_m ?? null,
            poi_lat: poi_lat ?? null,
            poi_lon: poi_lon ?? null
        });

        // Build location object for insertion, including POI fields
        const location = {
            device_id,
            serial_number: serial_number ?? null, // always from device table
            latitude,
            longitude,
            altitude: altitude ?? null,
            speed: speed ?? null,
            heading: heading ?? null,
            accuracy: accuracy ?? null,
            signal_strength: signal_strength ?? null,
            street_name: finalStreet ?? null,
            city_name: finalCity ?? null,
            place_name: finalPlace ?? null,
            context_tag: finalContext ?? null,
            timestamp,
            poi_name: poi_name ?? null,
            poi_type: poi_type ?? null,
            poi_distance_m: poi_distance_m ?? null,
            poi_distance_km: poi_distance_km ?? null,
            poi_lat: poi_lat ?? null,
            poi_lon: poi_lon ?? null,
            poi_distance: poi_distance_km ?? null
        };
        console.log('[LocationLog Insert]', location);
        const [result] = await pool.query('INSERT INTO location_log SET ?', [location]);
        const insertResult = result as ResultSetHeader;
        res.status(201).json({
            log_id: insertResult.insertId,
            ...location
        });

        // Emit real-time update if valid coordinates
        if (device_id && latitude && longitude) {
            const io = req.app.get('io');
            if (io) {
                io.emit('location_update', {
                    device_id,
                    latitude,
                    longitude,
                    street_name: finalStreet,
                    city_name: finalCity,
                    place_name: finalPlace,
                    context_tag: finalContext,
                    timestamp: timestamp || new Date().toISOString(),
                    poi_name,
                    poi_type,
                    poi_distance_km,
                    poi_distance_m,
                    poi_lat,
                    poi_lon
                });
                console.log(`📡 Emitting location_update for device ${device_id}`);
            }
        }
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
