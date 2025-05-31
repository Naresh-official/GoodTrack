import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0
});

// Database initialization function
export async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff', 'viewer') DEFAULT 'viewer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create goods table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS goods (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create logs table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        good_id INT NOT NULL,
        old_quantity INT NOT NULL,
        new_quantity INT NOT NULL,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (good_id) REFERENCES goods(id) ON DELETE CASCADE
      )
    `);

    // Create trigger for logging quantity changes
    await connection.execute(`
      CREATE TRIGGER IF NOT EXISTS log_quantity_changes
      AFTER UPDATE ON goods
      FOR EACH ROW
      BEGIN
        IF OLD.quantity != NEW.quantity THEN
          INSERT INTO logs (good_id, old_quantity, new_quantity)
          VALUES (NEW.id, OLD.quantity, NEW.quantity);
        END IF;
      END
    `);

    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}