import express from 'express';
import signUpUser from "../controllers/signUpUserController.js";

const router = express.Router();
try {
    router.post('/signup', signUpUser);
} catch (error) {
    console.error('Error setting up signup route:', error);
}

export default router;
