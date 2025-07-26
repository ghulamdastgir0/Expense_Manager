import getDashboard from '../controllers/dashboardController.js';
import express from 'express';
import verifyToken from '../middleware/verifyToken.js';

const router= express.Router();

router.get('/dashboard', verifyToken, getDashboard);
export default router;