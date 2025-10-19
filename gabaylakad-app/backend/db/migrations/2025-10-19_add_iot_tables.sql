-- Migration: Add missing IoT telemetry tables for GabayLakad Dashboard
-- Date: 2025-10-19
-- Adds battery_status, night_reflector_status, and (optionally) activity_log tables
-- Also creates a unified view for location logs if both gps_tracking and location_log exist

-- 1. Battery Status Table
CREATE TABLE IF NOT EXISTS battery_status (
    battery_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    battery_level DECIMAL(5,2) NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES device(device_id),
    INDEX idx_battery_device (device_id),
    INDEX idx_battery_timestamp (timestamp),
    INDEX idx_battery_device_time (device_id, timestamp)
);

-- 2. Night Reflector Status Table
CREATE TABLE IF NOT EXISTS night_reflector_status (
    reflector_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    status ENUM('on','off') NOT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES device(device_id),
    INDEX idx_reflector_device (device_id),
    INDEX idx_reflector_timestamp (timestamp),
    INDEX idx_reflector_device_time (device_id, timestamp)
);

-- 3. Activity Log Table (optional, only if sensor_log is not sufficient)
-- If you already use sensor_log for activity, you may skip this table.
CREATE TABLE IF NOT EXISTS activity_log (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    payload JSON,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (device_id) REFERENCES device(device_id),
    INDEX idx_activity_device (device_id),
    INDEX idx_activity_timestamp (timestamp),
    INDEX idx_activity_device_time (device_id, timestamp)
);

-- 4. Unified Location Logs View (read-only, safe)
-- Both gps_tracking and location_log exist. Recommend unifying later.
CREATE OR REPLACE VIEW location_logs_view AS
    SELECT device_id, latitude, longitude, timestamp, created_at FROM gps_tracking
    UNION ALL
    SELECT device_id, latitude, longitude, created_at AS timestamp, created_at FROM location_log;

-- 5. (Optional) Test seed data for validation (commented out)
-- INSERT INTO battery_status (device_id, battery_level) VALUES (1, 95.5);
-- INSERT INTO night_reflector_status (device_id, status) VALUES (1, 'on');
-- INSERT INTO activity_log (device_id, event_type, payload) VALUES (1, 'step_count', '{"steps":1234}');

-- Note: Do not drop or rename any existing tables. This migration is non-destructive.
-- If you have both gps_tracking and location_log, consider unifying them in the future.
