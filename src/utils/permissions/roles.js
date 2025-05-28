// Sistema de roles y permisos para CCB

export const ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // Dashboard
  VIEW_DASHBOARD: 'view_dashboard',
  
  // Eventos
  VIEW_EVENTS: 'view_events',
  CREATE_EVENTS: 'create_events',
  EDIT_EVENTS: 'edit_events',
  DELETE_EVENTS: 'delete_events',
  MANAGE_EVENTS: 'manage_events',
  
  // Visitantes
  VIEW_VISITORS: 'view_visitors',
  REGISTER_VISITORS: 'register_visitors',
  EDIT_VISITORS: 'edit_visitors',
  DELETE_VISITORS: 'delete_visitors',
  MANAGE_VISITORS: 'manage_visitors',
  
  // Usuarios
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  MANAGE_USERS: 'manage_users',
  
  // Reportes
  VIEW_REPORTS: 'view_reports',
  EXPORT_REPORTS: 'export_reports',
  
  // Configuración
  VIEW_SETTINGS: 'view_settings',
  MANAGE_SETTINGS: 'manage_settings',
  
  // Kioscos
  VIEW_KIOSKS: 'view_kiosks',
  MANAGE_KIOSKS: 'manage_kiosks'
};

// Definición de permisos por rol
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Todos los permisos
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.CREATE_EVENTS,
    PERMISSIONS.EDIT_EVENTS,
    PERMISSIONS.VIEW_VISITORS,
    PERMISSIONS.REGISTER_VISITORS,
    PERMISSIONS.EDIT_VISITORS,
    PERMISSIONS.MANAGE_VISITORS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_KIOSKS
  ],
  
  [ROLES.VIEWER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_EVENTS,
    PERMISSIONS.VIEW_VISITORS,
    PERMISSIONS.VIEW_REPORTS
  ]
};
