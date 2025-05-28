// controlador de configuración del sistema y kioscos
import logger from '../utils/logger.js';

// Configuración del sistema por defecto
let systemConfig = {
  general: {
    app_name: 'CCB SolidJS Platform',
    version: '1.0.0',
    timezone: 'America/Santo_Domingo',
    language: 'es',
    date_format: 'DD/MM/YYYY',
    time_format: '24h',
    max_file_size: 10485760, // 10MB en bytes
    allowed_file_types: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
  },
  security: {
    session_timeout: 1800, // 30 minutos
    max_login_attempts: 5,
    lockout_duration: 300, // 5 minutos
    password_min_length: 8,
    require_2fa: false,
    allowed_ips: []
  },
  branding: {
    primary_color: '#F99D2A',
    secondary_color: '#00BDF2',
    accent_color: '#474C55',
    logo_url: '/assets/images/ccb-logo.png',
    favicon_url: '/assets/images/favicon.ico',
    custom_css: ''
  }
};

let kioskConfigs = [
  {
    id: 1,
    name: 'Kiosco Entrada Principal',
    location: 'Lobby Principal',
    ip_address: '192.168.1.100',
    mac_address: '00:1B:44:11:3A:B7',
    is_active: true,
    last_ping: new Date().toISOString(),
    status: 'online',
    version: '1.0.0',
    settings: {
      idle_timeout: 300,
      auto_refresh: true,
      show_events: true,
      allow_registration: true,
      allow_checkin: true
    },
    stats: {
      registrations_today: 15,
      checkins_today: 12,
      uptime_percentage: 98.5,
      last_maintenance: '2025-05-20T09:00:00Z'
    }
  }
];
// Obtener configuración general del sistema
export const getSystemConfig = async (req, res) => {
  try {
    const { section } = req.query;
    
    if (section && systemConfig[section]) {
      res.json({
        success: true,
        config: { [section]: systemConfig[section] }
      });
    } else {
      res.json({
        success: true,
        config: systemConfig
      });
    }
  } catch (error) {
    logger.error('Error obteniendo configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener configuración',
      error: error.message
    });
  }
};

// Actualizar configuración del sistema
export const updateSystemConfig = async (req, res) => {
  try {
    const { section, config } = req.body;
    
    if (!section || !config) {
      return res.status(400).json({
        success: false,
        message: 'Se requieren los campos section y config'
      });
    }
    
    if (!systemConfig[section]) {
      return res.status(404).json({
        success: false,
        message: 'Sección de configuración no encontrada'
      });
    }
    
    // Actualizar la configuración
    systemConfig[section] = { ...systemConfig[section], ...config };
    
    res.json({
      success: true,
      message: 'Configuración actualizada exitosamente',
      config: systemConfig[section]
    });
    
  } catch (error) {
    logger.error('Error actualizando configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar configuración',
      error: error.message
    });
  }
};

export default {
  getSystemConfig,
  updateSystemConfig
};