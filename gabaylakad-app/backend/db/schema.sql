
-- GabayLakad Database Schema
CREATE DATABASE IF NOT EXISTS gabay_db;
USE gabay_db;

-- Table: user
CREATE TABLE IF NOT EXISTS user (
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
	is_verified BOOLEAN NOT NULL DEFAULT FALSE,
	verification_code VARCHAR(10),
	refresh_token VARCHAR(255) DEFAULT NULL,
	reset_token VARCHAR(255) DEFAULT NULL,
	reset_token_expires DATETIME DEFAULT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: contact
CREATE TABLE IF NOT EXISTS contact (
	contact_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	phone_number VARCHAR(20) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	google_id VARCHAR(128) DEFAULT NULL,
	email VARCHAR(100) DEFAULT NULL,
	is_active BIT(1) NOT NULL DEFAULT b'1',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: device
CREATE TABLE IF NOT EXISTS device (
	device_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	serial_number VARCHAR(100) NOT NULL UNIQUE,
	is_active BIT(1) NOT NULL DEFAULT b'1',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: alert
CREATE TABLE IF NOT EXISTS alert (
	alert_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	device_id INT(8) NOT NULL,
	user_id INT(8) NOT NULL,
	alert_type VARCHAR(50) NOT NULL,
	alert_description TEXT NOT NULL,
	timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	is_resolved BIT(1) DEFAULT b'0',
	resolved_at DATETIME DEFAULT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX idx_alert_device_id (device_id),
	INDEX idx_alert_user_id (user_id),
	INDEX idx_alert_type (alert_type),
	INDEX idx_alert_timestamp (timestamp),
	FOREIGN KEY (device_id) REFERENCES device(device_id),
	FOREIGN KEY (user_id) REFERENCES user(user_id)
);

-- Table: gps_tracking
CREATE TABLE IF NOT EXISTS gps_tracking (
	gps_track_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	device_id INT(8) NOT NULL,
	latitude FLOAT(10,6) NOT NULL,
	longitude FLOAT(10,6) NOT NULL,
	timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX idx_gps_device_id (device_id),
	INDEX idx_gps_latitude (latitude),
	INDEX idx_gps_timestamp (timestamp),
	FOREIGN KEY (device_id) REFERENCES device(device_id)
);

-- Table: location_log
CREATE TABLE IF NOT EXISTS location_log (
	log_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	device_id INT(8) NOT NULL,
	latitude FLOAT(10,6) NOT NULL,
	longitude FLOAT(10,6) NOT NULL,
	timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX idx_loc_device_id (device_id),
	INDEX idx_loc_latitude (latitude),
	INDEX idx_loc_timestamp (timestamp),
	FOREIGN KEY (device_id) REFERENCES device(device_id)
);

-- Table: sensor_log
CREATE TABLE IF NOT EXISTS sensor_log (
	sens_log_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	device_id INT(8) NOT NULL,
	sensor_type VARCHAR(50) NOT NULL,
	sensor_value DECIMAL(10,4) DEFAULT NULL,
	timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX idx_sensor_device_id (device_id),
	INDEX idx_sensor_type (sensor_type),
	INDEX idx_sensor_timestamp (timestamp),
	FOREIGN KEY (device_id) REFERENCES device(device_id)
);

-- Table: user_contact
CREATE TABLE IF NOT EXISTS user_contact (
	user_contact_id INT(8) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	contact_id INT(8) NOT NULL,
	user_id INT(8) NOT NULL,
	relationship VARCHAR(50) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	INDEX idx_uc_contact_id (contact_id),
	INDEX idx_uc_user_id (user_id),
	INDEX idx_uc_relationship (relationship),
	FOREIGN KEY (contact_id) REFERENCES contact(contact_id),
	FOREIGN KEY (user_id) REFERENCES user(user_id)
);
