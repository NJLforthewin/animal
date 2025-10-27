-- ==========================================================
-- GabayLakad Database Schema Verification Script
-- ==========================================================

USE gabalakad_database;

-- ----------------------------------------------------------
-- 1. Show all tables
-- ----------------------------------------------------------
SHOW TABLES;

-- ----------------------------------------------------------
-- 2. Describe each table (structure + data types)
-- ----------------------------------------------------------
DESCRIBE user;
DESCRIBE contact;
DESCRIBE device;
DESCRIBE alert;
DESCRIBE gps_tracking;
DESCRIBE location_log;
DESCRIBE sensor_log;
DESCRIBE user_contact;
DESCRIBE battery_status;
DESCRIBE night_reflector_status;
DESCRIBE activity_log;

-- ----------------------------------------------------------
-- 3. Show all indexes per table
-- ----------------------------------------------------------
SHOW INDEX FROM user;
SHOW INDEX FROM contact;
SHOW INDEX FROM device;
SHOW INDEX FROM alert;
SHOW INDEX FROM gps_tracking;
SHOW INDEX FROM location_log;
SHOW INDEX FROM sensor_log;
SHOW INDEX FROM user_contact;
SHOW INDEX FROM battery_status;
SHOW INDEX FROM night_reflector_status;
SHOW INDEX FROM activity_log;

-- ----------------------------------------------------------
-- 4. Show all foreign key relationships
-- ----------------------------------------------------------
SELECT 
    table_name,
    constraint_name,
    referenced_table_name,
    referenced_column_name
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'gabalakad_database'
AND referenced_table_name IS NOT NULL
ORDER BY table_name;

-- ----------------------------------------------------------
-- 5. Show all views (for dashboards)
-- ----------------------------------------------------------
SHOW FULL TABLES WHERE TABLE_TYPE = 'VIEW';

-- ----------------------------------------------------------
-- 6. Describe each dashboard view (optional)
-- ----------------------------------------------------------
DESCRIBE dashboard_battery_latest;
DESCRIBE dashboard_sensor_latest;
DESCRIBE dashboard_location_latest;
DESCRIBE dashboard_reflector_latest;
DESCRIBE dashboard_activity_latest;
DESCRIBE dashboard_latest;

-- ----------------------------------------------------------
-- 7. Quick content previews (first 5 rows for sanity check)
-- ----------------------------------------------------------
SELECT * FROM user LIMIT 5;
SELECT * FROM contact LIMIT 5;
SELECT * FROM device LIMIT 5;
SELECT * FROM alert LIMIT 5;
SELECT * FROM gps_tracking LIMIT 5;
SELECT * FROM location_log LIMIT 5;
SELECT * FROM sensor_log LIMIT 5;
SELECT * FROM user_contact LIMIT 5;
SELECT * FROM battery_status LIMIT 5;
SELECT * FROM night_reflector_status LIMIT 5;
SELECT * FROM activity_log LIMIT 5;

-- ----------------------------------------------------------
-- 8. Quick view data check
-- ----------------------------------------------------------
SELECT * FROM dashboard_latest LIMIT 5;
SELECT * FROM dashboard_battery_latest LIMIT 5;
SELECT * FROM dashboard_sensor_latest LIMIT 5;
SELECT * FROM dashboard_location_latest LIMIT 5;
SELECT * FROM dashboard_reflector_latest LIMIT 5;
SELECT * FROM dashboard_activity_latest LIMIT 5;

-- ----------------------------------------------------------
-- 9. Schema summary (counts)
-- ----------------------------------------------------------
SELECT COUNT(*) AS total_users FROM user;
SELECT COUNT(*) AS total_devices FROM device;
SELECT COUNT(*) AS total_contacts FROM contact;
SELECT COUNT(*) AS total_alerts FROM alert;
SELECT COUNT(*) AS total_sensor_logs FROM sensor_log;
SELECT COUNT(*) AS total_location_logs FROM location_log;
SELECT COUNT(*) AS total_battery_records FROM battery_status;
SELECT COUNT(*) AS total_reflector_records FROM night_reflector_status;
SELECT COUNT(*) AS total_activity_records FROM activity_log;

-- ----------------------------------------------------------
-- 10. Show all timestamps of creation for monitoring
-- ----------------------------------------------------------
SELECT 
    table_name, 
    create_time 
FROM information_schema.tables 
WHERE table_schema = 'gabalakad_database'
ORDER BY create_time DESC;

-- ----------------------------------------------------------
-- END OF SCHEMA VERIFICATION SCRIPT
-- ==========================================================
