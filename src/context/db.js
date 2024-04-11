const mysql = require('mysql2/promise')
// import mysql from '../../node_modules/mysql2/promise';
let _connection;

mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  // database: process.env.DB_NAME || 'your_database',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).then((conn) => {
  _connection = conn;
}).catch(err => {
  console.error('ERRO AO CONECTAR NO BANCO:', err)
});

/**
 * @type {mysql.Connection}
 */
export const connection = _connection;
