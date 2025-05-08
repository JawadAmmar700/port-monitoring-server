import { getDb } from '../config/database';

async function updateSchema() {
  const db = await getDb();
  
  // Drop existing tables if they exist
  await db.run('DROP TABLE IF EXISTS environmental_data');
  await db.run('DROP TABLE IF EXISTS sensors');
  
  // Create sensors table
  await db.run(`
    CREATE TABLE sensors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL
    )
  `);
  
  // Create environmental_data table with updated schema
  await db.run(`
    CREATE TABLE environmental_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensor_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      air_quality TEXT NOT NULL,
      water_quality TEXT NOT NULL,
      noise_level REAL NOT NULL,
      temperature REAL NOT NULL,
      humidity REAL NOT NULL,
      location TEXT NOT NULL,
      FOREIGN KEY (sensor_id) REFERENCES sensors(id)
    )
  `);
  
  // Create indexes for better query performance
  await db.run('CREATE INDEX IF NOT EXISTS idx_sensor_id ON environmental_data(sensor_id)');
  await db.run('CREATE INDEX IF NOT EXISTS idx_timestamp ON environmental_data(timestamp)');
  
  console.log('Database schema updated successfully');
}

updateSchema().catch(console.error); 