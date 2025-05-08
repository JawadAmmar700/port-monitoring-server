"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const environmentalData_1 = require("../models/environmentalData");
const generateSensorData = (sensorType, timestamp) => {
    const hour = timestamp.getHours();
    const day = timestamp.getDay();
    // Base data structure with realistic values for all sensor types
    const data = {
        air_quality: {
            co2: 400 + Math.sin(hour / 24 * Math.PI) * 100 + Math.random() * 50, // ppm
            no2: 20 + Math.sin(hour / 24 * Math.PI) * 10 + Math.random() * 5, // ppb
            so2: 10 + Math.sin(hour / 24 * Math.PI) * 5 + Math.random() * 3, // ppb
            pm25: 15 + Math.sin(hour / 24 * Math.PI) * 10 + Math.random() * 5 // µg/m³
        },
        water_quality: {
            ph: 7 + Math.sin(day / 7 * Math.PI) * 0.5 + Math.random() * 0.2,
            dissolved_oxygen: 8 + Math.sin(hour / 24 * Math.PI) * 2 + Math.random() * 1, // mg/L
            oil_spill_detected: Math.random() > 0.95
        },
        noise_level: 50 + Math.sin(hour / 24 * Math.PI) * 20 + Math.random() * 10, // dB
        temperature: 20 + Math.sin(day / 7 * Math.PI) * 5 + Math.random() * 2, // °C
        humidity: 50 + Math.sin(hour / 24 * Math.PI) * 20 + Math.random() * 10 // %
    };
    // Adjust values based on sensor type to make them more realistic
    switch (sensorType) {
        case 'air_quality':
            // Air quality sensors have more accurate air quality readings
            data.air_quality.co2 *= 1.2;
            data.air_quality.no2 *= 1.2;
            data.air_quality.so2 *= 1.2;
            data.air_quality.pm25 *= 1.2;
            break;
        case 'water_quality':
            // Water quality sensors have more accurate water readings
            data.water_quality.ph = 7.5 + Math.sin(hour / 24 * Math.PI) * 0.3;
            data.water_quality.dissolved_oxygen *= 1.2;
            break;
        case 'noise':
            // Noise sensors have more accurate noise readings
            data.noise_level *= 1.2;
            break;
        case 'temperature':
            // Temperature sensors have more accurate temperature readings
            data.temperature *= 1.2;
            break;
        case 'humidity':
            // Humidity sensors have more accurate humidity readings
            data.humidity *= 1.2;
            break;
    }
    return data;
};
async function generateMockData() {
    try {
        // Initialize database
        await (0, environmentalData_1.initializeDb)();
        // Create sensors
        for (const sensor of constants_1.SENSORS) {
            await (0, environmentalData_1.createSensor)(sensor);
        }
        // Generate 100 days of data
        const now = new Date();
        const startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 100);
        for (let day = 0; day < 100; day++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + day);
            // Generate 24 hourly readings for each sensor
            for (let hour = 0; hour < 24; hour++) {
                const timestamp = new Date(currentDate);
                timestamp.setHours(hour);
                for (const sensor of constants_1.SENSORS) {
                    const sensorData = generateSensorData(sensor.type, timestamp);
                    await (0, environmentalData_1.createEnvironmentalData)({
                        sensor_id: sensor.id,
                        timestamp,
                        ...sensorData,
                        location: sensor.location
                    });
                }
            }
        }
        console.log('Mock data generated successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error generating mock data:', error);
        process.exit(1);
    }
}
generateMockData();
