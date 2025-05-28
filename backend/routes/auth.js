import express from 'express';
import { login, register, validateToken, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas de autenticación
router.post('/login', login);
router.post('/register', register);
router.get('/validate', validateToken);
router.get('/profile', authenticateToken, getProfile);

export default router;
