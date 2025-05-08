import { Request, Response } from 'express';
import {
  EnvironmentalData,
  createEnvironmentalData,
  getLatestEnvironmentalData,
  getHistoricalData as getHistoricalDataFromDB,
  getRecordCount
} from '../models/environmentalData';
import { getDb } from '../config/database';

export const createData = async (req: Request, res: Response) => {
  try {
    const data: EnvironmentalData = req.body;
    const result = await createEnvironmentalData(data);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating environmental data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLatestData = async (req: Request, res: Response) => {
  try {
    const { sensorId } = req.query;
    const result = await getLatestEnvironmentalData(sensorId as string);
    res.json(result);
  } catch (error) {
    console.error('Error fetching latest environmental data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getHistoricalData = async (req: Request, res: Response) => {
  try {
    const { sensorId, startDate, endDate } = req.query;
    
    // Get a list of all sensor IDs to use as default
    const db = await getDb();
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
      ? new Date(startDate as string)
      : new Date(dateRange.minDate);
    
    const queryEndDate = endDate
      ? new Date(endDate as string)
      : new Date(dateRange.maxDate);
    
    console.log('Using parameters:', {
      sensorId: sensorId || defaultSensorId,
      startDate: queryStartDate.toISOString().split('T')[0],
      endDate: queryEndDate.toISOString().split('T')[0]
    });
    
    const result = await getHistoricalDataFromDB(
      (sensorId as string) || defaultSensorId,
      queryStartDate,
      queryEndDate
    );
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mock data generator for testing
export const generateMockData = async (req: Request, res: Response) => {
  try {
    const mockData: EnvironmentalData = {
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

    const result = await createEnvironmentalData(mockData);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error generating mock data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDebugInfo = async (req: Request, res: Response) => {
  try {
    const count = await getRecordCount();
    res.json({ recordCount: count });
  } catch (error) {
    console.error('Error getting debug info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 