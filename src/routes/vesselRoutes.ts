import { Router } from "express";
import { Database } from "sqlite";
import { VesselModel, Vessel } from "../models/Vessel";
import { v4 as uuidv4 } from "uuid";

export const createVesselRoutes = (db: Database) => {
  const router = Router();

  // Get all vessels
  router.get("/", async (req, res) => {
    try {
      const vessels = await VesselModel.findAll(db);
      res.json(vessels);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vessels" });
    }
  });

  // Get vessel by ID
  router.get("/:id", async (req, res) => {
    try {
      const vessel = await VesselModel.findById(db, req.params.id);
      if (!vessel) {
        return res.status(404).json({ error: "Vessel not found" });
      }
      res.json(vessel);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vessel" });
    }
  });

  // Create new vessel
  router.post("/", async (req, res) => {
    try {
      const vesselData: Omit<Vessel, "id" | "createdAt" | "updatedAt"> =
        req.body;
      const newVessel = await VesselModel.create(db, {
        ...vesselData,
        id: uuidv4(),
      });
      res.status(201).json(newVessel);
    } catch (error) {
      res.status(500).json({ error: "Failed to create vessel" });
    }
  });

  // Update vessel
  router.put("/:id", async (req, res) => {
    try {
      const vesselData: Partial<Vessel> = req.body;
      await VesselModel.update(db, req.params.id, vesselData);
      const updatedVessel = await VesselModel.findById(db, req.params.id);
      if (!updatedVessel) {
        return res.status(404).json({ error: "Vessel not found" });
      }
      res.json(updatedVessel);
    } catch (error) {
      res.status(500).json({ error: "Failed to update vessel" });
    }
  });

  // Delete vessel
  router.delete("/:id", async (req, res) => {
    try {
      const vessel = await VesselModel.findById(db, req.params.id);
      if (!vessel) {
        return res.status(404).json({ error: "Vessel not found" });
      }
      await VesselModel.delete(db, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vessel" });
    }
  });

  return router;
};
