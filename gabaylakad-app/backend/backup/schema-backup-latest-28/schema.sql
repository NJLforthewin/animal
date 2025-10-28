CREATE DATABASE IF NOT EXISTS gabay_database;
USE gabay_database;

-- ----------------------------------------------------
-- Table: user
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS `user` (
  user_id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  blind_full_name varchar(100) DEFAULT NULL,
  blind_age int DEFAULT NULL,
  blind_phone_number varchar(20) DEFAULT NULL,
  first_name varchar(100) NOT NULL,
  last_name varchar(100) NOT NULL,
  email varchar(100) NOT NULL,
  phone_number varchar(20) NOT NULL,
  impairment_level varchar(50) NOT NULL,
  device_id int DEFAULT NULL,
  password varchar(255) NOT NULL,
  is_verified tinyint(1) NOT NULL DEFAULT '0',
  verification_code varchar(10) DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  refresh_token varchar(255) DEFAULT NULL,
  relationship varchar(50) DEFAULT NULL,
  reset_token varchar(255) DEFAULT NULL,
  reset_token_expires datetime DEFAULT NULL,
  avatar varchar(255) DEFAULT NULL,
  terms_accepted_at DATETIME DEFAULT NULL,
  privacy_accepted_at DATETIME DEFAULT NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
-- ----------------------------------------------------
-- Table: device_status
-- ----------------------------------------------------

-- ----------------------------------------------------
-- Table: device
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS device (
  device_id INT NOT NULL AUTO_INCREMENT,
  serial_number VARCHAR(100) NOT NULL,
  is_active bit(1) NOT NULL DEFAULT b'1',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (device_id),
  UNIQUE KEY serial_number (serial_number)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: device_status
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS device_status (
  device_id INT NOT NULL PRIMARY KEY,
  obstacle_distance FLOAT,
  obstacle_severity VARCHAR(10),
  gsm_connected TINYINT(1),
  gsm_signal_strength INT,
  button_action VARCHAR(10),
  vibration_pattern INT,
  vibration_duration INT,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_status_device FOREIGN KEY (device_id) REFERENCES device(device_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contact (
  contact_id int NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL,
  phone_number varchar(20) NOT NULL,
  password varchar(255) NOT NULL,
  google_id varchar(128) DEFAULT NULL,
  email varchar(100) DEFAULT NULL,
  is_active bit(1) NOT NULL DEFAULT b'1',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (contact_id),
  UNIQUE KEY phone_number (phone_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: device
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS device (
  device_id INT NOT NULL AUTO_INCREMENT,
  serial_number VARCHAR(100) NOT NULL,
  is_active bit(1) NOT NULL DEFAULT b'1',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (device_id),
  UNIQUE KEY serial_number (serial_number)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: alert
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS alert (
  alert_id int NOT NULL AUTO_INCREMENT,
  device_id int NOT NULL,
  serial_number varchar(100) DEFAULT NULL,
  user_id int NOT NULL,
  alert_type varchar(50) NOT NULL,
  alert_description text NOT NULL,
  trigger_type varchar(50) DEFAULT NULL,
  timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_resolved bit(1) DEFAULT b'0',
  resolved_at datetime DEFAULT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (alert_id),
  KEY idx_alert_device_id (device_id),
  KEY idx_alert_user_id (user_id),
  KEY idx_alert_type_timestamp (alert_type, timestamp),
  CONSTRAINT alert_ibfk_1 FOREIGN KEY (device_id) REFERENCES device (device_id),
  CONSTRAINT alert_ibfk_2 FOREIGN KEY (user_id) REFERENCES user (user_id),
  CONSTRAINT fk_alert_device FOREIGN KEY (device_id) REFERENCES device (device_id),
  CONSTRAINT fk_alert_user FOREIGN KEY (user_id) REFERENCES user (user_id)
) ENGINE=InnoDB AUTO_INCREMENT=1418 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  log_id int NOT NULL AUTO_INCREMENT,
  device_id int NOT NULL,
  serial_number varchar(100) DEFAULT NULL,
  latitude float(10,6) NOT NULL,
  longitude float(10,6) NOT NULL,
  timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  altitude float DEFAULT NULL,
  speed float DEFAULT NULL,
  heading float DEFAULT NULL,
  accuracy float DEFAULT NULL,
  signal_strength int DEFAULT NULL,
  street_name varchar(255) DEFAULT NULL,
  city_name varchar(255) DEFAULT NULL,
  place_name varchar(255) DEFAULT NULL,
  context_tag varchar(255) DEFAULT NULL,
  poi_name varchar(255) DEFAULT NULL,
  poi_type varchar(100) DEFAULT NULL,
  poi_distance_m int DEFAULT NULL,
  poi_distance_km float DEFAULT NULL,
  poi_lat float(10,6) DEFAULT NULL,
  poi_lon float(10,6) DEFAULT NULL,
  poi_distance float DEFAULT NULL,
  PRIMARY KEY (log_id),
  KEY idx_loc_device_id (device_id),
  KEY idx_loc_latitude (latitude),
  KEY idx_loc_timestamp (timestamp),
  KEY idx_location_device_timestamp (device_id, timestamp),
  CONSTRAINT fk_location_device FOREIGN KEY (device_id) REFERENCES device (device_id),
  CONSTRAINT location_log_ibfk_1 FOREIGN KEY (device_id) REFERENCES device (device_id)
) ENGINE=InnoDB AUTO_INCREMENT=1518 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: sensor_log
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS sensor_log (
  sens_log_id int NOT NULL AUTO_INCREMENT,
  device_id int NOT NULL,
  sensor_type varchar(50) NOT NULL,
  sensor_value decimal(10,4) DEFAULT NULL,
  timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sens_log_id),
  KEY idx_sensor_device_id (device_id),
  KEY idx_sensor_type_timestamp (sensor_type, timestamp),
  CONSTRAINT fk_sensor_device FOREIGN KEY (device_id) REFERENCES device (device_id),
  CONSTRAINT sensor_log_ibfk_1 FOREIGN KEY (device_id) REFERENCES device (device_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: user_contact
-- (associative table connecting users and contact entries)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS user_contact (
  user_contact_id int NOT NULL AUTO_INCREMENT,
  contact_id int NOT NULL,
  user_id int NOT NULL,
  relationship varchar(50) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_contact_id),
  KEY idx_uc_contact_id (contact_id),
  KEY idx_uc_user_id (user_id),
  KEY idx_uc_relationship (relationship),
  CONSTRAINT user_contact_ibfk_1 FOREIGN KEY (contact_id) REFERENCES contact (contact_id),
  CONSTRAINT user_contact_ibfk_2 FOREIGN KEY (user_id) REFERENCES user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: battery_status (IoT telemetry)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS battery_status (
  battery_id int NOT NULL AUTO_INCREMENT,
  device_id int NOT NULL,
  battery_level decimal(5,2) NOT NULL,
  timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (battery_id),
  KEY idx_battery_device (device_id),
  KEY idx_battery_timestamp (timestamp),
  KEY idx_battery_device_timestamp (device_id, timestamp),
  CONSTRAINT battery_status_ibfk_1 FOREIGN KEY (device_id) REFERENCES device (device_id),
  CONSTRAINT fk_battery_device FOREIGN KEY (device_id) REFERENCES device (device_id)
) ENGINE=InnoDB AUTO_INCREMENT=1519 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: night_reflector_status (IoT telemetry)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS night_reflector_status (
  reflector_id int NOT NULL AUTO_INCREMENT,
  device_id int NOT NULL,
  status enum('on','off') NOT NULL,
  timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (reflector_id),
  KEY idx_reflector_device_time (device_id, timestamp),
  CONSTRAINT fk_reflector_device FOREIGN KEY (device_id) REFERENCES device (device_id),
  CONSTRAINT night_reflector_status_ibfk_1 FOREIGN KEY (device_id) REFERENCES device (device_id)
) ENGINE=InnoDB AUTO_INCREMENT=1478 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
-- Table: activity_log
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
  id int NOT NULL AUTO_INCREMENT,
  device_id int NOT NULL,
  event_type varchar(64) NOT NULL,
  payload json DEFAULT NULL,
  timestamp datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_device_time (device_id, timestamp),
  CONSTRAINT activity_log_ibfk_1 FOREIGN KEY (device_id) REFERENCES device (device_id)
) ENGINE=InnoDB AUTO_INCREMENT=1417 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------------------------------
DROP TABLE IF EXISTS `location_logs_view`;
/*!50001 DROP VIEW IF EXISTS `location_logs_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `location_logs_view` AS SELECT
 1 AS `device_id`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `timestamp`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

-- ----------------------------------------------------
-- Dashboard aggregation views (latest-per-device)
-- ----------------------------------------------------
DROP TABLE IF EXISTS `dashboard_battery_latest`;
/*!50001 DROP VIEW IF EXISTS `dashboard_battery_latest`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `dashboard_battery_latest` AS SELECT
 1 AS `device_id`,
 1 AS `battery_level`,
 1 AS `timestamp`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `dashboard_sensor_latest`;
/*!50001 DROP VIEW IF EXISTS `dashboard_sensor_latest`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `dashboard_sensor_latest` AS SELECT
 1 AS `device_id`,
 1 AS `sensor_type`,
 1 AS `sensor_value`,
 1 AS `timestamp`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `dashboard_location_latest`;
/*!50001 DROP VIEW IF EXISTS `dashboard_location_latest`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `dashboard_location_latest` AS SELECT
 1 AS `device_id`,
 1 AS `latitude`,
 1 AS `longitude`,
 1 AS `altitude`,
 1 AS `speed`,
 1 AS `heading`,
 1 AS `accuracy`,
 1 AS `signal_strength`,
 1 AS `timestamp`,
 1 AS `street_name`,
 1 AS `city_name`,
 1 AS `place_name`,
 1 AS `context_tag`,
 1 AS `poi_name`,
 1 AS `poi_type`,
 1 AS `poi_distance`,
 1 AS `poi_distance_m`,
 1 AS `poi_distance_km`,
 1 AS `poi_lat`,
 1 AS `poi_lon`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `dashboard_reflector_latest`;
/*!50001 DROP VIEW IF EXISTS `dashboard_reflector_latest`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `dashboard_reflector_latest` AS SELECT
 1 AS `device_id`,
 1 AS `status`,
 1 AS `timestamp`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `dashboard_activity_latest`;
/*!50001 DROP VIEW IF EXISTS `dashboard_activity_latest`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `dashboard_activity_latest` AS SELECT
 1 AS `device_id`,
 1 AS `last_activity`,
 1 AS `timestamp`*/;
SET character_set_client = @saved_cs_client;

-- Consolidated view showing latest info per device
DROP TABLE IF EXISTS `dashboard_latest`;
/*!50001 DROP VIEW IF EXISTS `dashboard_latest`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
DROP VIEW IF EXISTS dashboard_latest;

CREATE VIEW dashboard_latest AS
SELECT
  d.device_id,
  d.serial_number,
  ds.obstacle_distance,
  ds.obstacle_severity,
  ds.gsm_connected,
  ds.gsm_signal_strength,
  ds.button_action,
  ds.vibration_pattern,
  ds.vibration_duration,
  ds.updated_at AS status_updated_at
FROM device d
LEFT JOIN device_status ds ON d.device_id = ds.device_id;
SET character_set_client = @saved_cs_client;

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
