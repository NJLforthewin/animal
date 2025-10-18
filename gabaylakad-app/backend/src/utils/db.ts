import mysql from 'mysql2/promise';
import dbConfig from '../../db/db.config';

const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    port: dbConfig.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const query = async (sql: string, params?: any[]) => {
    const [rows] = await pool.execute(sql, params);
    return { rows };
};

export const getClient = async () => {
    return pool.getConnection();
};