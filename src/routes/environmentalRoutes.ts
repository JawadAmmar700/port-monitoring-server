import express, { RequestHandler } from 'express';
import {
  createData,
  getLatestData,
  getHistoricalData,
  getDebugInfo
} from '../controllers/environmentalController';

const router = express.Router();

// Environmental data routes
router.post('/data', createData as RequestHandler);
router.get('/data/latest', getLatestData as RequestHandler);
router.get('/data/historical', getHistoricalData as RequestHandler);
router.get('/debug', getDebugInfo as RequestHandler);

export default router; 