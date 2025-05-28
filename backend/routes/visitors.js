import express from 'express';
import {
  getAllVisitors,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteVisitor,
  registerToEvent,
  checkInVisitor,
  getVisitorStats,
  searchVisitor
} from '../controllers/visitorController.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para kiosco)
router.post('/register', createVisitor); // Registro público desde kiosco
router.post('/checkin', checkInVisitor); // Check-in desde kiosco
router.get('/search/:query', searchVisitor); // Búsqueda pública

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, requirePermission('view_visitors'), getAllVisitors);
router.get('/stats', authenticateToken, requirePermission('view_reports'), getVisitorStats);
router.get('/:id', authenticateToken, requirePermission('view_visitors'), getVisitorById);
router.put('/:id', authenticateToken, requirePermission('manage_visitors'), updateVisitor);
router.delete('/:id', authenticateToken, requirePermission('manage_visitors'), deleteVisitor);

// Gestión de eventos
router.post('/register-to-event', authenticateToken, requirePermission('manage_visitors'), registerToEvent);

export default router;
