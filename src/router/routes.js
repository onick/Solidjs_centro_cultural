import { lazy } from 'solid-js';

// Lazy loading de páginas para mejor rendimiento
const Home = lazy(() => import('../pages/Home'));
const Events = lazy(() => import('../pages/Events'));
const EventDetails = lazy(() => import('../pages/EventDetails'));
const Registration = lazy(() => import('../pages/Registration'));
const Checkin = lazy(() => import('../pages/Checkin'));

// Páginas de autenticación
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

// Páginas de administración
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const AdminEvents = lazy(() => import('../pages/admin/Events'));
const AdminVisitors = lazy(() => import('../pages/admin/Visitors'));
const AdminUsers = lazy(() => import('../pages/admin/Users'));
const AdminReports = lazy(() => import('../pages/admin/Reports'));
const AdminSettings = lazy(() => import('../pages/admin/Settings'));

// Nuevas páginas de la Fase 4
const EventsManagement = lazy(() => import('../pages/admin/EventsManagement'));
const VisitorsManagement = lazy(() => import('../pages/admin/VisitorsManagement'));
const ReportsManagement = lazy(() => import('../pages/admin/ReportsManagement'));
const SystemConfiguration = lazy(() => import('../pages/admin/SystemConfiguration'));
const EventForm = lazy(() => import('../components/forms/EventForm'));

const NotFound = lazy(() => import('../pages/NotFound'));

// Configuración de rutas con protección avanzada
export const routes = [
  // Rutas públicas (Kiosco)
  {
    path: '/',
    component: Home,
    meta: { 
      title: 'Inicio - CCB',
      public: true 
    }
  },
  {
    path: '/eventos',
    component: Events,
    meta: { 
      title: 'Eventos - CCB',
      public: true 
    }
  },
  {
    path: '/eventos/:id',
    component: EventDetails,
    meta: { 
      title: 'Detalles del Evento - CCB',
      public: true 
    }
  },
  {
    path: '/registro',
    component: Registration,
    meta: { 
      title: 'Registro de Visitantes - CCB',
      public: true 
    }
  },
  {
    path: '/checkin',
    component: Checkin,
    meta: { 
      title: 'Check-in - CCB',
      public: true 
    }
  },

  // Rutas de autenticación
  {
    path: '/login',
    component: Login,
    meta: { 
      title: 'Iniciar Sesión - CCB',
      public: true,
      hideForAuthenticated: true
    }
  },
  {
    path: '/registro-usuario',
    component: Register,
    meta: { 
      title: 'Registro de Usuario - CCB',
      requiresAuth: true,
      permission: 'create_users'
    }
  },

  // Rutas de administración (protegidas)
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { 
      title: 'Dashboard - Admin CCB',
      requiresAuth: true,
      permission: 'view_dashboard'
    }
  },
  
  // Gestión Avanzada de Eventos (Fase 4)
  {
    path: '/admin/events',
    component: EventsManagement,
    meta: { 
      title: 'Gestión de Eventos - Admin CCB',
      requiresAuth: true,
      permission: 'view_events'
    }
  },
  {
    path: '/admin/events/create',
    component: () => <EventForm mode="create" />,
    meta: { 
      title: 'Crear Evento - Admin CCB',
      requiresAuth: true,
      permission: 'manage_events'
    }
  },
  {
    path: '/admin/events/:id/edit',
    component: (props) => <EventForm mode="edit" eventId={props.params.id} />,
    meta: { 
      title: 'Editar Evento - Admin CCB',
      requiresAuth: true,
      permission: 'manage_events'
    }
  },
  
  // Gestión Avanzada de Visitantes (Fase 4)
  {
    path: '/admin/visitors',
    component: VisitorsManagement,
    meta: { 
      title: 'Gestión de Visitantes - Admin CCB',
      requiresAuth: true,
      permission: 'view_visitors'
    }
  },
  
  // Sistema de Reportes Avanzado (Fase 4)
  {
    path: '/admin/reports',
    component: ReportsManagement,
    meta: { 
      title: 'Reportes Avanzados - Admin CCB',
      requiresAuth: true,
      permission: 'view_reports'
    }
  },
  
  // Configuración del Sistema (Fase 4)
  {
    path: '/admin/config',
    component: SystemConfiguration,
    meta: { 
      title: 'Configuración del Sistema - Admin CCB',
      requiresAuth: true,
      permission: 'manage_settings'
    }
  },
  
  // Rutas administrativas existentes (compatibilidad)
  {
    path: '/admin/users',
    component: AdminUsers,
    meta: { 
      title: 'Gestión de Usuarios - Admin CCB',
      requiresAuth: true,
      permission: 'view_users'
    }
  },
  {
    path: '/admin/settings',
    component: AdminSettings,
    meta: { 
      title: 'Configuración - Admin CCB',
      requiresAuth: true,
      permission: 'view_settings'
    }
  },

  // Ruta 404
  {
    path: '/*all',
    component: NotFound,
    meta: { 
      title: 'Página no encontrada - CCB',
      public: true 
    }
  }
];

// Función helper para verificar acceso a ruta
export function canAccessRoute(route, user) {
  // Rutas públicas
  if (route.meta?.public) {
    // Si es hideForAuthenticated y el usuario está autenticado, no permitir
    if (route.meta.hideForAuthenticated && user) {
      return false;
    }
    return true;
  }

  // Rutas que requieren autenticación
  if (route.meta?.requiresAuth) {
    if (!user) return false;

    // Verificar permiso específico
    if (route.meta.permission) {
      return user.permissions?.includes(route.meta.permission) || user.role === 'admin';
    }

    // Verificar rol específico
    if (route.meta.role) {
      return user.role === route.meta.role;
    }

    return true; // Usuario autenticado sin restricciones adicionales
  }

  return true; // Por defecto permitir acceso
}
