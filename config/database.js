const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'booking_orders',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

let isInitialized = false;

// Initialize database and create tables
async function initializeDatabase() {
  if (isInitialized) {
    return;
  }

  try {
    await createTables();
    isInitialized = true;
    console.log('Database tables verified successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Create necessary tables
async function createTables() {
  const createBookingOrdersTable = `
    CREATE TABLE IF NOT EXISTS booking_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      booking_dates JSON NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone_number VARCHAR(20) NOT NULL,
      email VARCHAR(255) NOT NULL,
      product_id BIGINT NOT NULL,
      variant_id BIGINT NOT NULL,
      quantity INT DEFAULT 1,
      shopify_checkout_id VARCHAR(255),
      shopify_checkout_url TEXT,
      status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_product_variant (product_id, variant_id),
      INDEX idx_created_at (created_at)
    )
  `;

  await pool.execute(createBookingOrdersTable);
}

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

module.exports = {
  pool,
  initializeDatabase,
  testConnection
};
