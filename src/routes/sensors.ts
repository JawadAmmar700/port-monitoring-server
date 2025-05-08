import express from 'express';
import { SENSORS } from '../constants';

const router = express.Router();

// GET /api/sensors
router.get('/', (req, res) => {
    res.json(SENSORS);
});

// GET /api/sensors/:id
router.get('/:id', (req, res) => {
    const sensor = SENSORS.find(s => s.id === req.params.id);
    if (!sensor) {
        return res.status(404).json({ message: 'Sensor not found' });
    }
    res.json(sensor);
});

export default router; 