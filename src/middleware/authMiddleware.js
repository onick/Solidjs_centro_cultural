import { authService } from '../utils/auth/authService';
import { appActions } from '../stores/appStore';

// Middleware principal de autenticación
export class AuthMiddleware {
  constructor() {
    this.publicRoutes = [
      '/',
      '/eventos',
      '/eventos/:id',
      '/registro',
      '/checkin',
      '/login'
    ];

    this.adminRoutes = [
      '/admin',
      '/admin/*'
    ];

    this.staffRoutes = [
      '/reports',
      '/kiosk-management'
    ];
  }

  // Verificar si la ruta es pública
  isPublicRoute(path) {
    return this.publicRoutes.some(route => {
      if (route.includes(':')) {
        const pattern = route.replace(/:[^/]+/g, '[^/]+');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(path);
      }
      return route === path;
    });
  }

  // Verificar si requiere autenticación
  requiresAuth(path) {
    return !this.isPublicRoute(path);
  }

  // Verificar permisos para ruta específica
  hasRoutePermission(path, user) {
    if (!user) return false;

    // Rutas de administración
    if (this.adminRoutes.some(route => 
      route.endsWith('*') 
        ? path.startsWith(route.slice(0, -1))
        : path === route
    )) {
      return user.role === 'admin';
    }

    // Rutas de staff
    if (this.staffRoutes.includes(path)) {
      return ['admin', 'staff'].includes(user.role);
    }

    return true; // Otras rutas autenticadas
  }

  // Middleware principal - verificar acceso a ruta
  async checkRouteAccess(to, from, navigate) {
    try {
      const path = to.pathname;
      
      // Verificar si es ruta pública
      if (this.isPublicRoute(path)) {
        return true;
      }

      // Verificar autenticación
      if (!authService.isAuthenticated()) {
        console.log('🔒 Usuario no autenticado, redirigiendo a login');
        navigate('/login', { replace: true });
        return false;
      }

      // Obtener usuario actual
      const user = authService.getCurrentUser();
      
      // Verificar permisos específicos de la ruta
      if (!this.hasRoutePermission(path, user)) {
        console.log('🚫 Usuario sin permisos para esta ruta:', path);
        
        // Redirigir según el rol
        const redirectPath = user.role === 'admin' ? '/admin' : '/';
        navigate(redirectPath, { replace: true });
        
        appActions.showNotification({
          type: 'warning',
          message: 'No tienes permisos para acceder a esta página'
        });
        
        return false;
      }

      // Verificar si el token sigue siendo válido
      const tokenValid = await this.validateToken();
      if (!tokenValid) {
        console.log('🔑 Token inválido, cerrando sesión');
        authService.logout();
        navigate('/login', { replace: true });
        return false;
      }

      console.log('✅ Acceso autorizado a:', path);
      return true;

    } catch (error) {
      console.error('Error en middleware de autenticación:', error);
      navigate('/login', { replace: true });
      return false;
    }
  }

  // Validar token con el servidor
  async validateToken() {
    try {
      const token = authService.getToken();
      if (!token) return false;

      const response = await fetch('http://localhost:3080/api/auth/validate', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.ok;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  // Middleware para actualizar última actividad
  updateLastActivity() {
    const now = new Date().toISOString();
    localStorage.setItem('ccb_last_activity', now);
  }

  // Verificar inactividad del usuario
  checkInactivity() {
    const lastActivity = localStorage.getItem('ccb_last_activity');
    if (!lastActivity) return false;

    const now = new Date();
    const lastActiveTime = new Date(lastActivity);
    const inactiveMinutes = (now - lastActiveTime) / (1000 * 60);

    // 30 minutos de inactividad
    return inactiveMinutes > 30;
  }

  // Cerrar sesión por inactividad
  handleInactivityLogout(navigate) {
    authService.logout();
    appActions.showNotification({
      type: 'info',
      message: 'Sesión cerrada por inactividad'
    });
    navigate('/login', { replace: true });
  }
}

export const authMiddleware = new AuthMiddleware();
