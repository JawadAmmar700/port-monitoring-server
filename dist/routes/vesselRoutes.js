"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVesselRoutes = void 0;
const express_1 = require("express");
const Vessel_1 = require("../models/Vessel");
const uuid_1 = require("uuid");
const createVesselRoutes = (db) => {
    const router = (0, express_1.Router)();
    // Get all vessels
    router.get("/", async (req, res) => {
        try {
            const vessels = await Vessel_1.VesselModel.findAll(db);
            res.json(vessels);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch vessels" });
        }
    });
    // Get vessel by ID
    router.get("/:id", async (req, res) => {
        try {
            const vessel = await Vessel_1.VesselModel.findById(db, req.params.id);
            if (!vessel) {
                return res.status(404).json({ error: "Vessel not found" });
            }
            res.json(vessel);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch vessel" });
        }
    });
    // Create new vessel
    router.post("/", async (req, res) => {
        try {
            const vesselData = req.body;
            const newVessel = await Vessel_1.VesselModel.create(db, {
                ...vesselData,
                id: (0, uuid_1.v4)(),
            });
            res.status(201).json(newVessel);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create vessel" });
        }
    });
    // Update vessel
    router.put("/:id", async (req, res) => {
        try {
            const vesselData = req.body;
            await Vessel_1.VesselModel.update(db, req.params.id, vesselData);
            const updatedVessel = await Vessel_1.VesselModel.findById(db, req.params.id);
            if (!updatedVessel) {
                return res.status(404).json({ error: "Vessel not found" });
            }
            res.json(updatedVessel);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to update vessel" });
        }
    });
    // Delete vessel
    router.delete("/:id", async (req, res) => {
        try {
            const vessel = await Vessel_1.VesselModel.findById(db, req.params.id);
            if (!vessel) {
                return res.status(404).json({ error: "Vessel not found" });
            }
            await Vessel_1.VesselModel.delete(db, req.params.id);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: "Failed to delete vessel" });
        }
    });
    return router;
};
exports.createVesselRoutes = createVesselRoutes;
