import { appActions } from '../../stores/appStore';

// Servicio de autenticación compatible con Vue.js
export class AuthService {
  constructor() {
    this.tokenKey = 'ccb_auth_token';
    this.userKey = 'ccb_user_data';
  }

  // Login - compatible con sistema Vue.js
  async login(credentials) {
    try {
      // Intentar login en nuestro backend
      let response = await fetch('http://localhost:3080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      // Si falla, intentar con sistema Vue.js
      if (!response.ok) {
        response = await fetch('http://localhost:8080/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
      }

      if (response.ok) {
        const data = await response.json();
        const { token, user } = data;
        
        // Guardar en localStorage (compatible con Vue.js)
        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
        
        // Actualizar store
        appActions.setUser(user);
        
        return { success: true, user, token };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Error de autenticación' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    appActions.logout();
  }

  // Verificar si está autenticado
  isAuthenticated() {
    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem(this.userKey);
    return !!(token && user);
  }

  // Obtener token
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  // Obtener usuario actual
  getCurrentUser() {
    const userData = localStorage.getItem(this.userKey);
    return userData ? JSON.parse(userData) : null;
  }

  // Restaurar sesión al iniciar
  restoreSession() {
    if (this.isAuthenticated()) {
      const user = this.getCurrentUser();
      appActions.setUser(user);
    }
  }
}

  // Registro de nuevos usuarios
  async register(userData) {
    try {
      // Intentar registro en nuestro backend
      let response = await fetch('http://localhost:3080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Si falla, intentar con sistema Vue.js (si tiene endpoint de registro)
      if (!response.ok) {
        response = await fetch('http://localhost:8080/api/v1/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
      }

      if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
      } else {
        const errorData = await response.json();
        return { success: false, error: errorData.message || 'Error al registrar usuario' };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }

  // Verificar permisos del usuario
  hasPermission(permission) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Super admin tiene todos los permisos
    if (user.role === 'admin') return true;
    
    // Verificar permisos específicos
    return user.permissions?.includes(permission) || false;
  }

  // Verificar rol del usuario
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Obtener permisos del usuario
  getUserPermissions() {
    const user = this.getCurrentUser();
    if (!user) return [];
    
    // Admin tiene todos los permisos
    if (user.role === 'admin') {
      return [
        'view_dashboard',
        'manage_events', 
        'manage_visitors',
        'manage_users',
        'view_reports',
        'manage_settings'
      ];
    }
    
    // Staff tiene permisos limitados
    if (user.role === 'staff') {
      return [
        'view_dashboard',
        'view_events',
        'manage_visitors',
        'view_reports'
      ];
    }
    
    return user.permissions || [];
  }
}

export const authService = new AuthService();
  }
