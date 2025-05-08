"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const environmentalController_1 = require("../controllers/environmentalController");
const router = express_1.default.Router();
// Environmental data routes
router.post('/data', environmentalController_1.createData);
router.get('/data/latest', environmentalController_1.getLatestData);
router.get('/data/historical', environmentalController_1.getHistoricalData);
router.get('/debug', environmentalController_1.getDebugInfo);
exports.default = router;
