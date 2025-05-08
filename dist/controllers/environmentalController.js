"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDebugInfo = exports.generateMockData = exports.getHistoricalData = exports.getLatestData = exports.createData = void 0;
const environmentalData_1 = require("../models/environmentalData");
const database_1 = require("../config/database");
const createData = async (req, res) => {
    try {
        const data = req.body;
        const result = await (0, environmentalData_1.createEnvironmentalData)(data);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error creating environmental data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.createData = createData;
const getLatestData = async (req, res) => {
    try {
        const { sensorId } = req.query;
        const result = await (0, environmentalData_1.getLatestEnvironmentalData)(sensorId);
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching latest environmental data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getLatestData = getLatestData;
const getHistoricalData = async (req, res) => {
    try {
        const { sensorId, startDate, endDate } = req.query;
        // Get a list of all sensor IDs to use as default
        const db = await (0, database_1.getDb)();
        const sensors = await db.all('SELECT DISTINCT sensor_id FROM environmental_data');
        const defaultSensorId = sensors.length > 0 ? sensors[0].sensor_id : 'sensor-1';
        // Get the date range of available data
        const dateRange = await db.get(`
      SELECT 
        MIN(date(timestamp)) as minDate,
        MAX(date(timestamp)) as maxDate
      FROM environmental_data
    `);
        console.log('Available date range:', dateRange);
        // Use provided dates or default to the available range
        const queryStartDate = startDate
            ? new Date(startDate)
            : new Date(dateRange.minDate);
        const queryEndDate = endDate
            ? new Date(endDate)
            : new Date(dateRange.maxDate);
        console.log('Using parameters:', {
            sensorId: sensorId || defaultSensorId,
            startDate: queryStartDate.toISOString().split('T')[0],
            endDate: queryEndDate.toISOString().split('T')[0]
        });
        const result = await (0, environmentalData_1.getHistoricalData)(sensorId || defaultSensorId, queryStartDate, queryEndDate);
        res.json(result);
    }
    catch (error) {
        console.error('Error fetching historical data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getHistoricalData = getHistoricalData;
// Mock data generator for testing
const generateMockData = async (req, res) => {
    try {
        const mockData = {
            sensor_id: 'sensor-' + Math.floor(Math.random() * 1000),
            timestamp: new Date(),
            air_quality: {
                co2: Math.random() * 1000,
                no2: Math.random() * 100,
                so2: Math.random() * 50,
                pm25: Math.random() * 200
            },
            water_quality: {
                ph: Math.random() * 14,
                dissolved_oxygen: Math.random() * 20,
                oil_spill_detected: Math.random() > 0.9
            },
            noise_level: Math.random() * 120,
            temperature: Math.random() * 40,
            humidity: Math.random() * 100,
            location: {
                latitude: 51.5074 + (Math.random() - 0.5) * 0.1,
                longitude: -0.1278 + (Math.random() - 0.5) * 0.1
            }
        };
        const result = await (0, environmentalData_1.createEnvironmentalData)(mockData);
        res.status(201).json(result);
    }
    catch (error) {
        console.error('Error generating mock data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.generateMockData = generateMockData;
const getDebugInfo = async (req, res) => {
    try {
        const count = await (0, environmentalData_1.getRecordCount)();
        res.json({ recordCount: count });
    }
    catch (error) {
        console.error('Error getting debug info:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getDebugInfo = getDebugInfo;
