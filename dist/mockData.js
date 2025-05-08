"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMockVesselData = exports.generateMockEnvironmentalData = void 0;
const Vessel_1 = require("./models/Vessel");
const uuid_1 = require("uuid");
const generateMockEnvironmentalData = () => {
    const timestamp = new Date().toISOString();
    // return {
    //     id: Math.random().toString(36).substr(2, 9),
    //     timestamp,
    //     air_quality: {
    //         co2: generateRandomValue(300, 1000),
    //         no2: generateRandomValue(0, 100),
    //         so2: generateRandomValue(0, 50),
    //         pm25: generateRandomValue(0, 50)
    //     },
    //     water_quality: {
    //         ph: generateRandomValue(6.5, 8.5),
    //         dissolved_oxygen: generateRandomValue(5, 12),
    //         oil_spill_detected: Math.random() > 0.95
    //     },
    //     noise_level: generateRandomValue(30, 90),
    //     temperature: generateRandomValue(15, 35),
    //     humidity: generateRandomValue(30, 90)
    // };
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const data = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp,
        air_quality: {
            co2: 400 + Math.sin((hour / 24) * Math.PI) * 100 + Math.random() * 50, // ppm
            no2: 20 + Math.sin((hour / 24) * Math.PI) * 10 + Math.random() * 5, // ppb
            so2: 10 + Math.sin((hour / 24) * Math.PI) * 5 + Math.random() * 3, // ppb
            pm25: 15 + Math.sin((hour / 24) * Math.PI) * 10 + Math.random() * 5, // µg/m³
        },
        water_quality: {
            ph: 7 + Math.sin((day / 7) * Math.PI) * 0.5 + Math.random() * 0.2,
            dissolved_oxygen: 8 + Math.sin((hour / 24) * Math.PI) * 2 + Math.random() * 1, // mg/L
            oil_spill_detected: Math.random() > 0.95,
        },
        noise_level: 50 + Math.sin((hour / 24) * Math.PI) * 20 + Math.random() * 10, // dB
        temperature: 20 + Math.sin((day / 7) * Math.PI) * 5 + Math.random() * 2, // °C
        humidity: 50 + Math.sin((hour / 24) * Math.PI) * 20 + Math.random() * 10, // %
    };
    return data;
};
exports.generateMockEnvironmentalData = generateMockEnvironmentalData;
const generateMockVesselData = async (db) => {
    const vesselTypes = [
        "Container Ship",
        "Bulk Carrier",
        "Oil Tanker",
        "Cruise Ship",
        "Cargo Ship",
    ];
    const statuses = ["Docked", "Anchored", "In Transit", "Loading", "Unloading"];
    const loadTypes = [
        "Containers",
        "Bulk Cargo",
        "Oil",
        "Passengers",
        "General Cargo",
    ];
    const ports = [
        "Dubai",
        "Singapore",
        "Rotterdam",
        "Shanghai",
        "Los Angeles",
        "Mumbai",
        "Hamburg",
    ];
    // Generate random coordinates within a reasonable range
    const latitude = 25.2048 + (Math.random() - 0.5) * 0.1; // Around Dubai
    const longitude = 55.2708 + (Math.random() - 0.5) * 0.1;
    const now = new Date();
    const vesselData = {
        id: (0, uuid_1.v4)(),
        name: `Vessel-${Math.floor(Math.random() * 1000)}`,
        type: vesselTypes[Math.floor(Math.random() * vesselTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        capacityTons: Math.floor(Math.random() * 50000) + 10000,
        loadTons: Math.floor(Math.random() * 40000) + 5000,
        loadType: loadTypes[Math.floor(Math.random() * loadTypes.length)],
        arrivedFrom: ports[Math.floor(Math.random() * ports.length)],
        arrivedTo: ports[Math.floor(Math.random() * ports.length)],
        nextDestination: ports[Math.floor(Math.random() * ports.length)],
        arrivalTime: new Date(Date.now() + Math.random() * 86400000),
        timeLeftMinutes: Math.floor(Math.random() * 1440),
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        lengthMeters: Math.floor(Math.random() * 300) + 100,
        widthMeters: Math.floor(Math.random() * 40) + 20,
        latitude,
        longitude,
        fuelConsumptionLitersPerHour: Math.floor(Math.random() * 2000) + 500,
        createdAt: now,
        updatedAt: now,
    };
    // Save to database
    await Vessel_1.VesselModel.create(db, vesselData);
    return vesselData;
};
exports.generateMockVesselData = generateMockVesselData;
