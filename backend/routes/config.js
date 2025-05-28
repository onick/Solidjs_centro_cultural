import express from 'express';
import {
  getSystemConfig,
  updateSystemConfig,
  getKioskConfigs,
  getKioskConfig,
  updateKioskConfig,
  kioskPing,
  restartKiosk,
  getKioskStats,
  exportSystemConfig
} from '../controllers/configController.js';
import { authenticateToken, requirePermission } from '../middleware/auth.js';

const router = express.Router();

// Rutas públicas (para kioscos)
router.post('/kiosk/ping', kioskPing); // Heartbeat de kioscos

// Configuración del sistema (requiere permisos de administrador)
router.get('/system', authenticateToken, requirePermission('manage_settings'), getSystemConfig);
router.put('/system', authenticateToken, requirePermission('manage_settings'), updateSystemConfig);
router.get('/export', authenticateToken, requirePermission('manage_settings'), exportSystemConfig);

// Gestión de kioscos
router.get('/kiosks', authenticateToken, requirePermission('view_kiosks'), getKioskConfigs);
router.get('/kiosks/stats', authenticateToken, requirePermission('view_reports'), getKioskStats);
router.get('/kiosks/:id', authenticateToken, requirePermission('view_kiosks'), getKioskConfig);
router.put('/kiosks/:id', authenticateToken, requirePermission('manage_kiosks'), updateKioskConfig);
router.post('/kiosks/:id/restart', authenticateToken, requirePermission('manage_kiosks'), restartKiosk);

export default router;
