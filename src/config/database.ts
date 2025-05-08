import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';

// Initialize SQLite database
const dbPath = path.join(__dirname, '../../data/environmental.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export async function getDb() {
  return open({
    filename: dbPath,
    driver: sqlite3.Database
  });
}

// Initialize database schema
export async function initializeDb() {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS environmental_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensor_id TEXT NOT NULL,
      timestamp DATETIME NOT NULL,
      air_quality TEXT NOT NULL,
      water_quality TEXT NOT NULL,
      noise_level REAL NOT NULL,
      temperature REAL NOT NULL,
      humidity REAL NOT NULL,
      location TEXT NOT NULL
    )
  `);
  
  return db;
}
