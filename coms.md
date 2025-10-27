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

\connect root@localhost

USE gabay_db;

node init-db.js

npm run simulate

npm run dev

npm start

cd "/c/Users/RYZEN 7/Desktop/redis"
./redis-server.exe