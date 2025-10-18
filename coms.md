-- GabayLakad: Reset All Table Content
-- This script will delete all rows from every table in the gabaylakad_db schema.
-- It disables and re-enables foreign key checks to avoid constraint errors.

USE gabaylakad_db;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE user_contact;
TRUNCATE TABLE sensor_log;
TRUNCATE TABLE location_log;
TRUNCATE TABLE gps_tracking;
TRUNCATE TABLE alert;
TRUNCATE TABLE device;
TRUNCATE TABLE contact;
TRUNCATE TABLE user;
SET FOREIGN_KEY_CHECKS = 1;


cd gabaylakad-app/frontend

cd gabaylakad-app/backend

cd gabaylakad-app/backend/db

\connect root@localhost

USE gabay_db;


cd "/c/Users/RYZEN 7/Desktop/redis"
./redis-server.exe