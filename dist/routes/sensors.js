"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constants_1 = require("../constants");
const router = express_1.default.Router();
// GET /api/sensors
router.get('/', (req, res) => {
    res.json(constants_1.SENSORS);
});
// GET /api/sensors/:id
router.get('/:id', (req, res) => {
    const sensor = constants_1.SENSORS.find(s => s.id === req.params.id);
    if (!sensor) {
        return res.status(404).json({ message: 'Sensor not found' });
    }
    res.json(sensor);
});
exports.default = router;
