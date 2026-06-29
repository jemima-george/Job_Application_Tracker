const fs = require('fs'); // allows javascript access to files on system
const path = require('path');
const pool = require('./dbPool.js');

// Migrations sql path
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function runMigrations() {
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql')).sort(); // Get sql files in order
  // Connect to database
  const client = await pool.connect();
  try {
    for (const file of files) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.log(`Applying migration: ${file}`);
      // Execute sql commands in database to create jobs table
      await client.query(sql);
    }
    console.log('Database migration applied successfully.');
  } finally {
    client.release(); // End connection pool
    await pool.end(); // End database connection
  }
}

runMigrations();