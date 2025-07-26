import history from "../controllers/historyContoller.js";
import express from 'express';
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.get('/history', verifyToken, history);

export default router;