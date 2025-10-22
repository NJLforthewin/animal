-- === Location Tracking Enhancements (Real-time Map Support) ===

-- Telemetry columns for richer location data are now part of CREATE TABLE location_log below.
-- Index idx_location_device_timestamp is already present in CREATE TABLE location_log and does not need to be created separately.
-- View for latest location per device is defined in the dashboard aggregation section below.
-- Finalized GabayLakad Database Schema
-- Run on MySQL server. Assumes user has sufficient privileges.

CREATE DATABASE IF NOT EXISTS gabay_db;
USE gabay_db;

-- ----------------------------------------------------
-- Table: user
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  user_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  blind_full_name VARCHAR(100),
  blind_age INT(3),
  blind_phone_number VARCHAR(20),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  impairment_level VARCHAR(50) NOT NULL,
  device_id VARCHAR(100) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  verification_code VARCHAR(10),
  reset_token VARCHAR(255) DEFAULT NULL,
  reset_token_expires DATETIME DEFAULT NULL,
  avatar VARCHAR(255) DEFAULT NULL,
  relationship VARCHAR(50) DEFAULT NULL,
  refresh_token VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: contact
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS contact (
  contact_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  google_id VARCHAR(128) DEFAULT NULL,
  email VARCHAR(100) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: device
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS device (
  device_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  serial_number VARCHAR(100) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: alert
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS alert (
  alert_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id INT(8) NOT NULL,
serial_number VARCHAR(100) NULL,
  user_id INT(8) NOT NULL,
  alert_type VARCHAR(50) NOT NULL,
  alert_description TEXT NOT NULL,
  is_resolved TINYINT(1) DEFAULT 0,
  resolved_at DATETIME DEFAULT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_alert_device_id (device_id),
  INDEX idx_alert_user_id (user_id),
  INDEX idx_alert_type_timestamp (alert_type, timestamp),
  INDEX idx_alert_timestamp (timestamp),
  CONSTRAINT fk_alert_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE,
  CONSTRAINT fk_alert_user FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: gps_tracking
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS gps_tracking (
  gps_track_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id INT(8) NOT NULL,
serial_number VARCHAR(100) NULL,
  latitude FLOAT(10,6) NOT NULL,
  longitude FLOAT(10,6) NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_gps_device_id (device_id),
  INDEX idx_gps_lat_long (latitude, longitude),
  CONSTRAINT fk_gps_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: location_log
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS location_log (
  log_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id INT(8) NOT NULL,
serial_number VARCHAR(100) NULL,
  latitude FLOAT(10,6) NOT NULL,
  longitude FLOAT(10,6) NOT NULL,
  altitude FLOAT NULL,
  speed FLOAT NULL,
  heading FLOAT NULL,
  accuracy FLOAT NULL,
  signal_strength INT NULL,
  street_name VARCHAR(255) NULL,
  city_name VARCHAR(255) NULL,
  place_name VARCHAR(255) NULL,
  context_tag VARCHAR(255) NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_loc_device_time (device_id, timestamp),
  INDEX idx_loc_latitude (latitude),
  INDEX idx_loc_timestamp (timestamp),
  CONSTRAINT fk_location_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: sensor_log
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS sensor_log (
  sens_log_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id INT(8) NOT NULL,
serial_number VARCHAR(100) NULL,
  sensor_type VARCHAR(64) NOT NULL,
  sensor_value DECIMAL(10,4) DEFAULT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sensor_device_id (device_id),
  INDEX idx_sensor_type_timestamp (sensor_type, timestamp),
  INDEX idx_sensor_timestamp (timestamp),
  CONSTRAINT fk_sensor_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: user_contact
-- (associative table connecting users and contact entries)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS user_contact (
  user_contact_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  contact_id INT(8) NOT NULL,
  user_id INT(8) NOT NULL,
  relationship VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_uc_contact_id (contact_id),
  INDEX idx_uc_user_id (user_id),
  CONSTRAINT fk_uc_contact FOREIGN KEY (contact_id) REFERENCES contact(contact_id) ON DELETE CASCADE,
  CONSTRAINT fk_uc_user FOREIGN KEY (user_id) REFERENCES `user`(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: battery_status (IoT telemetry)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS battery_status (
  battery_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  battery_level DECIMAL(5,2) DEFAULT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_battery_device_timestamp (device_id, timestamp),
  CONSTRAINT fk_battery_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: night_reflector_status (IoT telemetry)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS night_reflector_status (
  reflector_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  status ENUM('on','off') NOT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reflector_device_time (device_id, timestamp),
  CONSTRAINT fk_reflector_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Table: activity_log
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  device_id INT NOT NULL,
  event_type VARCHAR(64) NOT NULL,
  payload JSON DEFAULT NULL,
  timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_activity_device_time (device_id, timestamp),
  CONSTRAINT fk_activity_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------
-- Helpful view: unify gps_tracking + location_log (if still useful)
-- ----------------------------------------------------
CREATE OR REPLACE VIEW location_logs_view AS
  SELECT device_id, latitude, longitude, timestamp, created_at FROM gps_tracking
  UNION ALL
  SELECT device_id, latitude, longitude, timestamp, created_at FROM location_log;

-- ----------------------------------------------------
-- Dashboard aggregation views (latest-per-device)
-- ----------------------------------------------------
CREATE OR REPLACE VIEW dashboard_battery_latest AS
SELECT bs.device_id, bs.battery_level, bs.timestamp
FROM battery_status bs
INNER JOIN (
  SELECT device_id, MAX(timestamp) AS max_ts
  FROM battery_status
  GROUP BY device_id
) latest ON bs.device_id = latest.device_id AND bs.timestamp = latest.max_ts;

CREATE OR REPLACE VIEW dashboard_sensor_latest AS
SELECT sl.device_id, sl.sensor_type, sl.sensor_value, sl.timestamp
FROM sensor_log sl
INNER JOIN (
  SELECT device_id, MAX(timestamp) AS max_ts
  FROM sensor_log
  GROUP BY device_id
) latest ON sl.device_id = latest.device_id AND sl.timestamp = latest.max_ts;

CREATE OR REPLACE VIEW dashboard_location_latest AS
SELECT ll.device_id, ll.latitude, ll.longitude, ll.timestamp,
  ll.street_name, ll.city_name, ll.place_name, ll.context_tag,
  ll.poi_name, ll.poi_type, ll.poi_distance,
  ll.poi_distance_m, ll.poi_distance_km, ll.poi_lat, ll.poi_lon
FROM location_log ll
INNER JOIN (
  SELECT device_id, MAX(timestamp) AS max_ts
  FROM location_log
  GROUP BY device_id
) latest ON ll.device_id = latest.device_id AND ll.timestamp = latest.max_ts;

CREATE OR REPLACE VIEW dashboard_reflector_latest AS
SELECT nr.device_id, nr.status, nr.timestamp
FROM night_reflector_status nr
INNER JOIN (
  SELECT device_id, MAX(timestamp) AS max_ts
  FROM night_reflector_status
  GROUP BY device_id
) latest ON nr.device_id = latest.device_id AND nr.timestamp = latest.max_ts;

CREATE OR REPLACE VIEW dashboard_activity_latest AS
SELECT a.device_id, a.event_type AS last_activity, a.timestamp
FROM activity_log a
INNER JOIN (
  SELECT device_id, MAX(timestamp) AS max_ts
  FROM activity_log
  GROUP BY device_id
) latest ON a.device_id = latest.device_id AND a.timestamp = latest.max_ts;

-- Consolidated view showing latest info per device
CREATE OR REPLACE VIEW dashboard_latest AS
SELECT
  d.device_id,
  d.serial_number,
  b.battery_level,
  b.timestamp AS battery_timestamp,
  s.sensor_type,
  s.sensor_value,
  s.timestamp AS sensor_timestamp,
  l.latitude,
  l.longitude,
  l.altitude,
  l.speed,
  l.accuracy,
  l.signal_strength,
  l.street_name,
  l.city_name,
  l.place_name,
  l.context_tag,
  l.poi_name,
  l.poi_type,
  l.poi_distance,
  l.poi_distance_m,
  l.poi_distance_km,
  l.poi_lat,
  l.poi_lon,
  l.timestamp AS location_timestamp,
  r.status AS reflector_status,
  r.timestamp AS reflector_timestamp,
  a.alert_type,
  a.timestamp AS alert_timestamp,
  act.last_activity,
  act.timestamp AS activity_timestamp
FROM device d
LEFT JOIN dashboard_battery_latest b ON b.device_id = d.device_id
LEFT JOIN dashboard_sensor_latest s ON s.device_id = d.device_id
LEFT JOIN dashboard_location_latest l ON l.device_id = d.device_id
LEFT JOIN dashboard_reflector_latest r ON r.device_id = d.device_id
LEFT JOIN (
    SELECT aa1.device_id, aa1.alert_type, aa1.timestamp
    FROM alert aa1
    INNER JOIN (
      SELECT device_id, MAX(timestamp) AS max_ts FROM alert GROUP BY device_id
    ) aa2 ON aa1.device_id = aa2.device_id AND aa1.timestamp = aa2.max_ts
) a ON a.device_id = d.device_id
LEFT JOIN dashboard_activity_latest act ON act.device_id = d.device_id;

-- ----------------------------------------------------
-- Index housekeeping (additional helpful indexes)
-- ----------------------------------------------------
-- CREATE INDEX statements below must be run manually after checking for existence, as MySQL does not support IF NOT EXISTS for indexes.
-- CREATE INDEX idx_battery_device_timestamp ON battery_status(device_id, timestamp);
-- CREATE INDEX idx_sensor_type_timestamp ON sensor_log(sensor_type, timestamp);
-- CREATE INDEX idx_alert_type_timestamp ON alert(alert_type, timestamp);
-- CREATE INDEX idx_location_device_timestamp ON location_log(device_id, timestamp);
-- CREATE INDEX idx_activity_device_timestamp ON activity_log(device_id, timestamp);

-- End of schema.
