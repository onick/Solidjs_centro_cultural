import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from './roles';
import { authService } from '../auth/authService';

// Servicio de gestión de permisos
export class PermissionService {
  constructor() {
    this.roles = ROLES;
    this.permissions = PERMISSIONS;
    this.rolePermissions = ROLE_PERMISSIONS;
  }

  // Verificar si el usuario tiene un permiso específico
  hasPermission(permission) {
    const user = authService.getCurrentUser();
    if (!user) return false;

    const userPermissions = this.getUserPermissions(user);
    return userPermissions.includes(permission);
  }

  // Verificar si el usuario tiene un rol específico
  hasRole(role) {
    const user = authService.getCurrentUser();
    return user?.role === role;
  }

  // Verificar si el usuario tiene cualquiera de los roles especificados
  hasAnyRole(roles) {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    return roles.includes(user.role);
  }

  // Obtener todos los permisos del usuario
  getUserPermissions(user = null) {
    const currentUser = user || authService.getCurrentUser();
    if (!currentUser) return [];

    return this.rolePermissions[currentUser.role] || [];
  }

  // Verificar múltiples permisos (AND)  
  hasAllPermissions(permissions) {
    return permissions.every(permission => this.hasPermission(permission));
  }

  // Verificar múltiples permisos (OR)
  hasAnyPermission(permissions) {
    return permissions.some(permission => this.hasPermission(permission));
  }

  // Verificar acceso a una sección específica
  canAccessSection(section) {
    switch (section) {
      case 'dashboard':
        return this.hasPermission(PERMISSIONS.VIEW_DASHBOARD);
      
      case 'events':
        return this.hasPermission(PERMISSIONS.VIEW_EVENTS);
      
      case 'visitors':
        return this.hasPermission(PERMISSIONS.VIEW_VISITORS);
      
      case 'users':
        return this.hasPermission(PERMISSIONS.VIEW_USERS);
      
      case 'reports':
        return this.hasPermission(PERMISSIONS.VIEW_REPORTS);
      
      case 'settings':
        return this.hasPermission(PERMISSIONS.VIEW_SETTINGS);
      
      case 'kiosks':
        return this.hasPermission(PERMISSIONS.VIEW_KIOSKS);
      
      default:
        return false;
    }
  }

  // Verificar si puede realizar una acción específica sobre un recurso
  canPerformAction(action, resource) {
    const permissionKey = `${action.toUpperCase()}_${resource.toUpperCase()}`;
    return this.hasPermission(PERMISSIONS[permissionKey]);
  }

  // Obtener secciones disponibles para el usuario
  getAvailableSections() {
    const sections = [
      { name: 'dashboard', icon: '📊', route: '/admin', role: null },
      { name: 'events', icon: '🎭', route: '/admin/events', permission: PERMISSIONS.VIEW_EVENTS },
      { name: 'visitors', icon: '👥', route: '/admin/visitors', permission: PERMISSIONS.VIEW_VISITORS },
      { name: 'users', icon: '👤', route: '/admin/users', permission: PERMISSIONS.VIEW_USERS },
      { name: 'reports', icon: '📈', route: '/admin/reports', permission: PERMISSIONS.VIEW_REPORTS },
      { name: 'settings', icon: '⚙️', route: '/admin/settings', permission: PERMISSIONS.VIEW_SETTINGS },
      { name: 'kiosks', icon: '🖥️', route: '/admin/kiosks', permission: PERMISSIONS.VIEW_KIOSKS }
    ];

    return sections.filter(item => {
      if (item.permission) {
        return this.hasPermission(item.permission);
      }
      if (item.role) {
        return this.hasRole(item.role);
      }
      if (item.section) {
        return this.canAccessSection(item.section);
      }
      return true;
    });
  }
}

export default new PermissionService();

export const permissionService = new PermissionService();

// Hook personalizado para usar en componentes SolidJS
export function usePermissions() {
  return {
    hasPermission: (permission) => permissionService.hasPermission(permission),
    hasRole: (role) => permissionService.hasRole(role),
    hasAnyRole: (roles) => permissionService.hasAnyRole(roles),
    canAccessSection: (section) => permissionService.canAccessSection(section),
    canPerformAction: (action, resource) => permissionService.canPerformAction(action, resource),
    getAvailableSections: () => permissionService.getAvailableSections(),
    getUserPermissions: () => permissionService.getUserPermissions()
  };
}