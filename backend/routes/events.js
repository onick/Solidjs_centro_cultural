import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
  duplicateEvent
} from '../controllers/eventController.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para kiosco)
router.get('/public', getAllEvents); // Eventos activos para kiosco
router.get('/public/:id', getEventById); // Detalles de evento específico

// Rutas protegidas (requieren autenticación)
router.get('/', authenticateToken, requirePermission('view_events'), getAllEvents);
router.get('/:id', authenticateToken, requirePermission('view_events'), getEventById);
router.post('/', authenticateToken, requirePermission('manage_events'), createEvent);
router.put('/:id', authenticateToken, requirePermission('manage_events'), updateEvent);
router.delete('/:id', authenticateToken, requirePermission('manage_events'), deleteEvent);

// Rutas especiales
router.get('/:id/stats', authenticateToken, requirePermission('view_reports'), getEventStats);
router.post('/:id/duplicate', authenticateToken, requirePermission('manage_events'), duplicateEvent);

export default router;
