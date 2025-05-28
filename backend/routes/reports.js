import express from 'express';
import {
  getDashboardStats,
  getEventStats,
  getVisitorStats,
  getAttendanceReport,
  exportReport
} from '../controllers/reportsController.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas de reportes requieren autenticación y permisos
router.get('/dashboard', authenticateToken, requirePermission('view_dashboard'), getDashboardStats);
router.get('/events', authenticateToken, requirePermission('view_reports'), getEventStats);
router.get('/visitors', authenticateToken, requirePermission('view_reports'), getVisitorStats);
router.get('/attendance', authenticateToken, requirePermission('view_reports'), getAttendanceReport);
router.get('/export/:type/:format?', authenticateToken, requirePermission('view_reports'), exportReport);

export default router;