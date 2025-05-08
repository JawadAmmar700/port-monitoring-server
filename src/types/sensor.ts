export interface Location {
    latitude: number;
    longitude: number;
}

export interface Sensor {
    id: string;
    name: string;
    type: 'temperature' | 'humidity' | 'air_quality' | 'noise';
    location: Location;
    status: 'active' | 'inactive';
    lastReading?: {
        value: number;
        timestamp: string;
    };
} 