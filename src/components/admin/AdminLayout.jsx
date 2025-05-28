import { createSignal, onMount } from 'solid-js';
import { useNavigate, useLocation } from '@solidjs/router';
import { authService } from '../../utils/auth/authService';
import { usePermissions } from '../../utils/permissions/permissionService';
import Button from '../ui/Button';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const permissions = usePermissions();
  
  const [user, setUser] = createSignal(null);
  const [sidebarOpen, setSidebarOpen] = createSignal(false);

  onMount(() => {
    setUser(authService.getCurrentUser());
  });

  const handleLogout = () => {
    authService.logout();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    {
      path: '/admin',
      name: 'Dashboard',
      icon: '📊',
      permission: 'view_dashboard'
    },
    {
      path: '/admin/events',
      name: 'Eventos',
      icon: '🎭',
      permission: 'view_events'
    },
    {
      path: '/admin/visitors',
      name: 'Visitantes',
      icon: '👥',
      permission: 'view_visitors'
    },
    {
      path: '/admin/users',
      name: 'Usuarios',
      icon: '👤',
      permission: 'view_users'
    },
    {
      path: '/admin/reports',
      name: 'Reportes',
      icon: '📈',
      permission: 'view_reports'
    },
    {
      path: '/admin/settings',
      name: 'Configuración',
      icon: '⚙️',
      permission: 'view_settings'
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    permissions.hasPermission(item.permission)
  );

  const isActiveRoute = (path) => {
    return location.pathname === path || 
           (path !== '/admin' && location.pathname.startsWith(path));
  };

  return (
    <div class="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div class={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen() ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Logo y header */}
        <div class="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-ccb-orange to-ccb-blue">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span class="text-ccb-blue font-bold text-sm">CCB</span>
            </div>
            <span class="text-white font-semibold">Admin Panel</span>
          </div>
          
          {/* Botón cerrar en móvil */}
          <button
            class="lg:hidden text-white hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navegación */}
        <nav class="mt-6 px-3">
          <div class="space-y-1">
            {filteredMenuItems.map(item => (
              <a
                href={item.path}
                class={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  isActiveRoute(item.path)
                    ? 'bg-ccb-blue text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-ccb-blue'
                }`}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
              >
                <span class="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </a>
            ))}
          </div>
        </nav>

        {/* Usuario y logout */}
        <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-8 h-8 bg-ccb-blue rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-semibold">
                {user()?.name?.charAt(0) || user()?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {user()?.name || user()?.username}
              </p>
              <p class="text-xs text-gray-500 capitalize">
                {user()?.role}
              </p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            class="w-full"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Overlay para móvil */}
      {sidebarOpen() && (
        <div 
          class="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Contenido principal */}
      <div class="flex-1 lg:ml-0">
        {/* Header superior */}
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="flex items-center justify-between h-16 px-6">
            {/* Botón menú móvil */}
            <button
              class="lg:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Breadcrumb */}
            <div class="flex items-center space-x-2 text-sm text-gray-500">
              <span>Centro Cultural Banreservas</span>
              <span>/</span>
              <span class="text-ccb-blue font-medium">Administración</span>
            </div>

            {/* Acciones del header */}
            <div class="flex items-center space-x-4">
              <button
                class="text-gray-500 hover:text-ccb-blue"
                onClick={() => navigate('/')}
                title="Ir al kiosco"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
              
              <div class="text-right">
                <p class="text-xs text-gray-500">
                  {new Date().toLocaleDateString('es-DO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main class="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
