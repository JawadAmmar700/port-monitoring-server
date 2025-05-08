"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const dotenv_1 = __importDefault(require("dotenv"));
const sensors_1 = __importDefault(require("./routes/sensors"));
const environmentalRoutes_1 = __importDefault(require("./routes/environmentalRoutes"));
const vesselRoutes_1 = require("./routes/vesselRoutes");
const Vessel_1 = require("./models/Vessel");
const mockData_1 = require("./mockData");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});
// Initialize database
const initializeDatabase = async () => {
    const db = await (0, sqlite_1.open)({
        filename: "./data/port.db",
        driver: sqlite3_1.default.Database,
    });
    // Create tables
    await (0, Vessel_1.createVesselTable)(db);
    return db;
};
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
// Initialize database and set up routes
let db;
initializeDatabase()
    .then((database) => {
    db = database;
    // API Routes
    app.use("/api/sensors", sensors_1.default);
    app.use("/api/environmental", environmentalRoutes_1.default);
    app.use("/api/vessels", (0, vesselRoutes_1.createVesselRoutes)(db));
    app.get("/", (req, res) => {
        res.send("Port Monitoring System Backend is running");
    });
    // Socket.IO connection handling
    io.on("connection", (socket) => {
        console.log("Client connected");
        // Send initial data
        socket.emit("environmentalData", (0, mockData_1.generateMockEnvironmentalData)());
        // Set up interval to send environmental data
        const environmentalInterval = setInterval(() => {
            socket.emit("environmentalData", (0, mockData_1.generateMockEnvironmentalData)());
        }, 5000); // Send data every 5 seconds
        // Set up interval to generate new vessels (every 5 minutes)
        const newVesselInterval = setInterval(async () => {
            try {
                const newVessel = await (0, mockData_1.generateMockVesselData)(db);
                socket.emit("vesselData", newVessel);
                console.log("New vessel generated:", newVessel.name);
            }
            catch (error) {
                console.error("Error generating new vessel:", error);
            }
        }, 300000); // Every 5 minutes
        // Set up interval to update existing vessels (every 1 minute)
        const updateVesselsInterval = setInterval(async () => {
            try {
                const existingVessels = await Vessel_1.VesselModel.findAll(db);
                for (const vessel of existingVessels) {
                    // Update random properties
                    const updates = {
                        status: [
                            "Docked",
                            "Anchored",
                            "In Transit",
                            "Loading",
                            "Unloading",
                        ][Math.floor(Math.random() * 5)],
                        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                        timeLeftMinutes: Math.max(0, vessel.timeLeftMinutes - 1), // Decrease time left by 1 minute
                        latitude: vessel.latitude + (Math.random() - 0.5) * 0.01,
                        longitude: vessel.longitude + (Math.random() - 0.5) * 0.01,
                    };
                    await Vessel_1.VesselModel.update(db, vessel.id, updates);
                    socket.emit("vesselData", { ...vessel, ...updates });
                }
                console.log(`Updated ${existingVessels.length} vessels`);
            }
            catch (error) {
                console.error("Error updating vessels:", error);
            }
        }, 60000); // Every 1 minute
        socket.on("disconnect", () => {
            console.log("Client disconnected");
            clearInterval(environmentalInterval);
            clearInterval(newVesselInterval);
            clearInterval(updateVesselsInterval);
        });
    });
    const PORT = process.env.PORT || 3001;
    httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
});
