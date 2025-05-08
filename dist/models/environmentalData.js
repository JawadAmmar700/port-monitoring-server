"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordCount = exports.getHistoricalData = exports.getLatestEnvironmentalData = exports.createEnvironmentalData = exports.createSensor = exports.initializeDb = void 0;
const database_1 = require("../config/database");
const initializeDb = async () => {
    const db = await (0, database_1.getDb)();
    // Drop existing tables if they exist
    await db.run('DROP TABLE IF EXISTS environmental_data');
    await db.run('DROP TABLE IF EXISTS sensors');
    // Create sensors table
    await db.run(`
    CREATE TABLE IF NOT EXISTS sensors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT NOT NULL
    )
  `);
    // Create environmental_data table with all necessary columns
    await db.run(`
    CREATE TABLE IF NOT EXISTS environmental_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sensor_id TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      air_quality TEXT NOT NULL,
      water_quality TEXT NOT NULL,
      noise_level REAL NOT NULL,
      temperature REAL NOT NULL,
      humidity REAL NOT NULL,
      location TEXT NOT NULL,
      FOREIGN KEY (sensor_id) REFERENCES sensors (id)
    )
  `);
    // Create indexes
    await db.run('CREATE INDEX IF NOT EXISTS idx_sensor_id ON environmental_data(sensor_id)');
    await db.run('CREATE INDEX IF NOT EXISTS idx_timestamp ON environmental_data(timestamp)');
};
exports.initializeDb = initializeDb;
const createSensor = async (sensor) => {
    const db = await (0, database_1.getDb)();
    // Check if sensor already exists
    const existingSensor = await db.get('SELECT id FROM sensors WHERE id = ?', [sensor.id]);
    if (!existingSensor) {
        await db.run('INSERT INTO sensors (id, name, type, location) VALUES (?, ?, ?, ?)', [sensor.id, sensor.name, sensor.type, JSON.stringify(sensor.location)]);
    }
    return sensor;
};
exports.createSensor = createSensor;
const createEnvironmentalData = async (data) => {
    const db = await (0, database_1.getDb)();
    const result = await db.run(`INSERT INTO environmental_data (
      sensor_id, 
      timestamp, 
      air_quality, 
      water_quality, 
      noise_level, 
      temperature, 
      humidity, 
      location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
        data.sensor_id,
        data.timestamp.toISOString(),
        JSON.stringify(data.air_quality),
        JSON.stringify(data.water_quality),
        data.noise_level,
        data.temperature,
        data.humidity,
        JSON.stringify(data.location)
    ]);
    return { ...data, id: result.lastID };
};
exports.createEnvironmentalData = createEnvironmentalData;
const getLatestEnvironmentalData = async (sensorId) => {
    const db = await (0, database_1.getDb)();
    if (sensorId) {
        const result = await db.get(`SELECT 
        id,
        sensor_id,
        timestamp,
        json_extract(air_quality, '$') as air_quality,
        json_extract(water_quality, '$') as water_quality,
        noise_level,
        temperature,
        humidity,
        json_extract(location, '$') as location
       FROM environmental_data
       WHERE sensor_id = ?
       ORDER BY timestamp DESC
       LIMIT 1`, [sensorId]);
        return result;
    }
    const result = await db.get(`SELECT 
      id,
      sensor_id,
      timestamp,
      json_extract(air_quality, '$') as air_quality,
      json_extract(water_quality, '$') as water_quality,
      noise_level,
      temperature,
      humidity,
      json_extract(location, '$') as location
     FROM environmental_data
     ORDER BY timestamp DESC
     LIMIT 1`);
    return result;
};
exports.getLatestEnvironmentalData = getLatestEnvironmentalData;
const getHistoricalData = async (sensorId, startDate, endDate) => {
    const db = await (0, database_1.getDb)();
    const result = await db.all(`SELECT 
      id,
      sensor_id,
      timestamp,
      json_extract(air_quality, '$') as air_quality,
      json_extract(water_quality, '$') as water_quality,
      noise_level,
      temperature,
      humidity,
      json_extract(location, '$') as location
     FROM environmental_data
     WHERE sensor_id = ? AND timestamp BETWEEN ? AND ?
     ORDER BY timestamp ASC`, [sensorId, startDate.toISOString(), endDate.toISOString()]);
    return result;
};
exports.getHistoricalData = getHistoricalData;
const getRecordCount = async () => {
    const db = await (0, database_1.getDb)();
    const result = await db.get('SELECT COUNT(*) as count FROM environmental_data');
    return result.count;
};
exports.getRecordCount = getRecordCount;
