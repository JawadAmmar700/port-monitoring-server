"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VesselModel = exports.createVesselTable = void 0;
const createVesselTable = async (db) => {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS vessels (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      capacityTons REAL NOT NULL,
      loadTons REAL NOT NULL,
      loadType TEXT NOT NULL,
      arrivedFrom TEXT NOT NULL,
      arrivedTo TEXT NOT NULL,
      nextDestination TEXT NOT NULL,
      arrivalTime DATETIME NOT NULL,
      timeLeftMinutes INTEGER NOT NULL,
      color TEXT NOT NULL,
      lengthMeters REAL NOT NULL,
      widthMeters REAL NOT NULL,
      latitude REAL NOT NULL,
      longitude REAL NOT NULL,
      fuelConsumptionLitersPerHour REAL NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
exports.createVesselTable = createVesselTable;
exports.VesselModel = {
    async create(db, vessel) {
        const now = new Date();
        const result = await db.run(`
      INSERT INTO vessels (
        id, name, type, status, capacityTons, loadTons, loadType,
        arrivedFrom, arrivedTo, nextDestination, arrivalTime,
        timeLeftMinutes, color, lengthMeters, widthMeters,
        latitude, longitude, fuelConsumptionLitersPerHour,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            vessel.id,
            vessel.name,
            vessel.type,
            vessel.status,
            vessel.capacityTons,
            vessel.loadTons,
            vessel.loadType,
            vessel.arrivedFrom,
            vessel.arrivedTo,
            vessel.nextDestination,
            vessel.arrivalTime.toISOString(),
            vessel.timeLeftMinutes,
            vessel.color,
            vessel.lengthMeters,
            vessel.widthMeters,
            vessel.latitude,
            vessel.longitude,
            vessel.fuelConsumptionLitersPerHour,
            now.toISOString(),
            now.toISOString(),
        ]);
        return { ...vessel, createdAt: now, updatedAt: now };
    },
    async findAll(db) {
        return db.all("SELECT * FROM vessels");
    },
    async findById(db, id) {
        return db.get("SELECT * FROM vessels WHERE id = ?", id);
    },
    async update(db, id, vessel) {
        const updates = Object.entries(vessel)
            .filter(([key]) => key !== "id" && key !== "createdAt")
            .map(([key]) => `${key} = ?`);
        const values = Object.entries(vessel)
            .filter(([key]) => key !== "id" && key !== "createdAt")
            .map(([_, value]) => value instanceof Date ? value.toISOString() : value);
        values.push(new Date().toISOString()); // updatedAt
        values.push(id);
        await db.run(`
      UPDATE vessels 
      SET ${updates.join(", ")}, updatedAt = ?
      WHERE id = ?
    `, values);
    },
    async delete(db, id) {
        await db.run("DELETE FROM vessels WHERE id = ?", id);
    },
};
// Prisma Schema Definition
/*
model Vessel {
  id                      String   @id @default(cuid())
  name                    String
  type                    String
  status                  String
  capacityTons            Float
  loadTons                Float
  loadType                String
  arrivedFrom             String
  arrivedTo               String
  nextDestination         String
  arrivalTime             DateTime
  timeLeftMinutes         Int
  color                   String
  lengthMeters            Float
  widthMeters             Float
  latitude                Float
  longitude               Float
  fuelConsumptionLitersPerHour Float
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt
}
*/
