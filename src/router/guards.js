import { useNavigate } from '@solidjs/router';
import { authService } from '../utils/auth/authService';
import { permissionService } from '../utils/permissions/permissionService';
import { authMiddleware } from '../middleware/authMiddleware';
import { appActions } from '../stores/appStore';
import appStore from '../stores/appStore';

// Guard principal para rutas protegidas
export async function routeGuard(to, from) {
  const navigate = useNavigate();
  
  try {
    // Usar el middleware de autenticación
    const hasAccess = await authMiddleware.checkRouteAccess(to, from, navigate);
    
    if (!hasAccess) {
      return false;
    }

    // Actualizar última actividad
    authMiddleware.updateLastActivity();

    // Verificar inactividad
    if (authService.isAuthenticated() && authMiddleware.checkInactivity()) {
      authMiddleware.handleInactivityLogout(navigate);
      return false;
    }

    return true;

  } catch (error) {
    console.error('Error en guard de ruta:', error);
    navigate('/login', { replace: true });
    return false;
  }
}

// Guard específico para rutas de administración
export function adminGuard() {
  const navigate = useNavigate();
  
  if (!authService.isAuthenticated()) {
    navigate('/login', { replace: true });
    return false;
  }
  
  if (!permissionService.hasRole('admin')) {
    navigate('/', { replace: true });
    appActions.showNotification({
      type: 'warning',
      message: 'Acceso denegado: Se requieren permisos de administrador'
    });
    return false;
  }
  
  return true;
}

// Guard para verificar permisos específicos
export function permissionGuard(permission) {
  return () => {
    const navigate = useNavigate();
    
    if (!authService.isAuthenticated()) {
      navigate('/login', { replace: true });
      return false;
    }
    
    if (!permissionService.hasPermission(permission)) {
      navigate('/admin', { replace: true });
      appActions.showNotification({
        type: 'warning',
        message: 'No tienes permisos para acceder a esta página'
      });
      return false;
    }
    
    return true;
  };
}

// Guard para redirección automática de usuarios autenticados
export function guestGuard() {
  const navigate = useNavigate();
  
  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    const redirectPath = user.role === 'admin' ? '/admin' : '/';
    navigate(redirectPath, { replace: true });
    return false;
  }
  
  return true;
}

// Middleware para actualizar título de página
export function updatePageTitle(route) {
  if (route.meta?.title) {
    document.title = route.meta.title;
  }
}

// Middleware para logging de navegación
export function logNavigation(from, to) {
  console.log(`🚀 Navigation: ${from?.pathname || 'unknown'} → ${to.pathname}`);
  
  // Log de acceso para auditoría
  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    console.log(`👤 User: ${user.username} accessing ${to.pathname}`);
  }
}

// Guard compuesto que combina múltiples verificaciones
export function createCompositeGuard(...guards) {
  return async (to, from) => {
    for (const guard of guards) {
      const result = typeof guard === 'function' 
        ? await guard(to, from) 
        : await guard();
        
      if (!result) {
        return false;
      }
    }
    return true;
  };
}

// Hook para usar guards en componentes
export function useRouteGuards() {
  return {
    routeGuard,
    adminGuard,
    permissionGuard,
    guestGuard,
    updatePageTitle,
    logNavigation,
    createCompositeGuard
  };
}
