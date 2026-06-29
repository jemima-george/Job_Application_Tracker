// Connect to PostgreSQL database 
// Faster connection by using exisiting connection from pool 

const { Pool } = require('pg');
require('dotenv').config();

// Intialise PostgreSQL connection 
const pool = new Pool(
  // Use direct database url hosted on cloud or use local PostgreSQL
  // Check encription security 
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.PGHOST || 'localhost',
        port: process.env.PGPORT || 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
      }
);

// Export database connection pool 
module.exports = pool;