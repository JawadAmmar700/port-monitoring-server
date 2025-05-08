export interface AirQuality {
    co2: number;    // ppm
    no2: number;    // ppb
    so2: number;    // ppb
    pm25: number;   // µg/m³
}

export interface WaterQuality {
    ph: number;                 // pH value
    dissolved_oxygen: number;    // mg/L
    oil_spill_detected: boolean;
}

export interface EnvironmentalData {
    id: string;
    timestamp: string;
    air_quality: AirQuality;
    water_quality: WaterQuality;
    noise_level: number;
    temperature: number;
    humidity: number;
} 