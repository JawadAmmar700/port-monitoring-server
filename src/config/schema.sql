-- Create environmental_data table
CREATE TABLE IF NOT EXISTS environmental_data (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    air_quality JSONB NOT NULL,
    water_quality JSONB NOT NULL,
    noise_level DECIMAL NOT NULL,
    temperature DECIMAL NOT NULL,
    humidity DECIMAL NOT NULL,
    location JSONB NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sensor_id ON environmental_data(sensor_id);
CREATE INDEX IF NOT EXISTS idx_timestamp ON environmental_data(timestamp);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 