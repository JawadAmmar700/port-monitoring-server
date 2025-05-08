import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import sensorsRouter from "./routes/sensors";
import environmentalRoutes from "./routes/environmentalRoutes";
import { createVesselRoutes } from "./routes/vesselRoutes";
import { createVesselTable, VesselModel } from "./models/Vessel";
import {
  generateMockEnvironmentalData,
  generateMockVesselData,
} from "./mockData";

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Initialize database
const initializeDatabase = async () => {
  const db = await open({
    filename: "./data/port.db",
    driver: sqlite3.Database,
  });

  // Create tables
  await createVesselTable(db);

  return db;
};

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Initialize database and set up routes
let db: any;
initializeDatabase()
  .then((database) => {
    db = database;

    // API Routes
    app.use("/api/sensors", sensorsRouter);
    app.use("/api/environmental", environmentalRoutes);
    app.use("/api/vessels", createVesselRoutes(db));

    app.get("/", (req, res) => {
      res.send("Port Monitoring System Backend is running");
    });

    // Socket.IO connection handling
    io.on("connection", (socket) => {
      console.log("Client connected");

      // Send initial data
      socket.emit("environmentalData", generateMockEnvironmentalData());

      // Set up interval to send environmental data
      const environmentalInterval = setInterval(() => {
        socket.emit("environmentalData", generateMockEnvironmentalData());
      }, 5000); // Send data every 5 seconds

      // Set up interval to generate new vessels (every 5 minutes)
      const newVesselInterval = setInterval(async () => {
        try {
          const newVessel = await generateMockVesselData(db);
          socket.emit("vesselData", newVessel);
          console.log("New vessel generated:", newVessel.name);
        } catch (error) {
          console.error("Error generating new vessel:", error);
        }
      }, 20000); // Every 5 minutes

      // Set up interval to update existing vessels (every 1 minute)
      const updateVesselsInterval = setInterval(async () => {
        try {
          const existingVessels = await VesselModel.findAll(db);
          for (const vessel of existingVessels) {
            // Update random properties
            const updates: Partial<typeof vessel> = {
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

            await VesselModel.update(db, vessel.id, updates);
            socket.emit("vesselData", { ...vessel, ...updates });
          }
          console.log(`Updated ${existingVessels.length} vessels`);
        } catch (error) {
          console.error("Error updating vessels:", error);
        }
      }, 5000); // Every 1 minute

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
