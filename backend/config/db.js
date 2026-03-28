// Database connection pool configuration using mysql2/promise
const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool for efficient DB access
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'brain_visualizer',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test the connection and log result on startup
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅  MySQL database connected successfully');
    conn.release();
  } catch (err) {
    console.warn('⚠️  MySQL connection failed:', err.message);
    console.warn('   The API will use built-in fallback data for emotion mappings.');
  }
}

testConnection();

module.exports = pool;

