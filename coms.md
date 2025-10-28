OPEN 3 
cd "C:\Program Files\MySQL\MySQL Server 9.2\bin"
mysqldump -u root -p --no-data gabay_db

cd gabaylakad-app/frontend
npm start

cd gabaylakad-app/backend
npm start

cd gabaylakad-app/mobile
npx react-native run-android

cd gabaylakad-app/backend/db
USE gabalakad_database; gabay_database

\connect root@localhost


USE gabay_db;

node init-db.js

npm run simulate

npm run dev

npm start

cd "/c/Users/RYZEN 7/Desktop/redis"
./redis-server.exe


SELECT u.user_id, u.email, u.name, d.device_id, d.serial_number
                                               -> FROM user u
                                               -> JOIN device d ON u.device_id = d.device_id
                                               -> WHERE d.serial_number = 'GL001';

DELETE FROM device_status WHERE device_id = 62;
DELETE FROM alert WHERE device_id = 62;
DELETE FROM gps_tracking WHERE device_id = 62;
DELETE FROM location_log WHERE device_id = 62;
DELETE FROM sensor_log WHERE device_id = 62;
DELETE FROM battery_status WHERE device_id = 62;
DELETE FROM night_reflector_status WHERE device_id = 62;
DELETE FROM activity_log WHERE device_id = 62;