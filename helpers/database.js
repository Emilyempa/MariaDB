import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 5,
});


pool.getConnection((err, conn) => {
    if (err) {
        if (err.code==='PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost.');
        }
        if (err.code==='ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.');
        }
        if (err.code==='ECONNREFUSED') {
            console.error('Database connection was refused.');
        }
}  
if(conn) conn.release();

return;
});


export default pool;