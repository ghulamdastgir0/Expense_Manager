import loginUser from "../controllers/signInUserController.js"
import express from 'express';

const router = express.Router();

router.post('/login', loginUser);

export default router;
