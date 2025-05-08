"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
exports.initializeDb = initializeDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Initialize SQLite database
const dbPath = path_1.default.join(__dirname, '../../data/environmental.db');
// Ensure data directory exists
const dataDir = path_1.default.dirname(dbPath);
if (!fs_1.default.existsSync(dataDir)) {
    fs_1.default.mkdirSync(dataDir, { recursive: true });
}
async function getDb() {
    return (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database
    });
}
// Initialize database schema
async function initializeDb() {
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
