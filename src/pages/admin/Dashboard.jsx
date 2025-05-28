import { createSignal, onMount } from 'solid-js';
import { usePermissions } from '../../utils/permissions/permissionService';
import { PERMISSIONS } from '../../utils/permissions/roles';
import { authService } from '../../utils/auth/authService';
import { eventActions } from '../../stores/eventStore';
import { visitorActions } from '../../stores/visitorStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const permissions = usePermissions();
  const [stats, setStats] = createSignal({
    events: { total: 0, active: 0, today: 0 },
    visitors: { total: 0, today: 0, checkedIn: 0 },
    kiosks: { total: 0, online: 0, offline: 0 }
  });
  
  const [loading, setLoading] = createSignal(true);
  const [user, setUser] = createSignal(null);

  onMount(async () => {
    // Obtener usuario actual
    setUser(authService.getCurrentUser());
    
    // Cargar estadísticas
    await loadStats();
    setLoading(false);
  });

  const loadStats = async () => {
    try {
      // Cargar estadísticas de eventos
      const eventsData = await eventActions.fetchEvents();
      const activeEvents = eventsData.filter(e => e.isActive).length;
      const todayEvents = eventsData.filter(e => {
        const eventDate = new Date(e.startDate);
        const today = new Date();
        return eventDate.toDateString() === today.toDateString();
      }).length;

      // Cargar estadísticas de visitantes
      const visitorsData = await visitorActions.fetchVisitors();
      const todayVisitors = visitorsData.filter(v => {
        const regDate = new Date(v.registrationDate);
        const today = new Date();
        return regDate.toDateString() === today.toDateString();
      }).length;
      
      const checkedInVisitors = visitorsData.filter(v => v.checkedIn).length;

      setStats({
        events: {
          total: eventsData.length,
          active: activeEvents,
          today: todayEvents
        },
        visitors: {
          total: visitorsData.length,
          today: todayVisitors,
          checkedIn: checkedInVisitors
        },
        kiosks: {
          total: 2, // CCB tiene 2 kioscos configurados
          online: 2,
          offline: 0
        }
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
    }
  };

  const StatCard = ({ title, value, subtitle, color, action }) => (
    <Card class={`p-6 ${color} text-white`}>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm opacity-90">{title}</p>
          <p class="text-3xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p class="text-sm opacity-75 mt-1">{subtitle}</p>
          )}
        </div>
        {action && (
          <div class="ml-4">
            {action}
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div class="p-6 space-y-6">
      {/* Header */}
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-ccb-gray-dark">
            Panel de Administración
          </h1>
          <p class="text-ccb-gray mt-1">
            Bienvenido, {user()?.name || user()?.username}
          </p>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="text-right text-sm text-ccb-gray">
            <p>Centro Cultural Banreservas</p>
            <p>Último acceso: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas principales */}
      {loading() ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <Card class="p-6 animate-pulse">
              <div class="h-4 bg-gray-200 rounded mb-2"></div>
              <div class="h-8 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Eventos Totales"
            value={stats().events.total}
            subtitle={`${stats().events.active} activos`}
            color="bg-gradient-to-r from-ccb-blue to-blue-600"
            action={
              permissions.hasPermission(PERMISSIONS.VIEW_EVENTS) && (
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 9h12v7H4V9z" />
                </svg>
              )
            }
          />

          <StatCard
            title="Visitantes Hoy"
            value={stats().visitors.today}
            subtitle={`${stats().visitors.total} total`}
            color="bg-gradient-to-r from-ccb-orange to-orange-600"
            action={
              permissions.hasPermission(PERMISSIONS.VIEW_VISITORS) && (
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              )
            }
          />

          <StatCard
            title="Check-ins Hoy"
            value={stats().visitors.checkedIn}
            subtitle="Asistencia confirmada"
            color="bg-gradient-to-r from-green-500 to-green-600"
            action={
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            }
          />

          <StatCard
            title="Kioscos Online"
            value={`${stats().kiosks.online}/${stats().kiosks.total}`}
            subtitle="Estado del sistema"
            color="bg-gradient-to-r from-purple-500 to-purple-600"
            action={
              permissions.hasPermission(PERMISSIONS.VIEW_KIOSKS) && (
                <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clip-rule="evenodd" />
                </svg>
              )
            }
          />
        </div>
      )}

      {/* Acciones rápidas */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {permissions.hasPermission(PERMISSIONS.CREATE_EVENTS) && (
          <Card class="p-6">
            <h3 class="text-lg font-semibold text-ccb-gray-dark mb-3">
              Gestión de Eventos
            </h3>
            <p class="text-sm text-ccb-gray mb-4">
              Crear y administrar eventos culturales
            </p>
            <Button variant="primary" class="w-full">
              Nuevo Evento
            </Button>
          </Card>
        )}

        {permissions.hasPermission(PERMISSIONS.VIEW_VISITORS) && (
          <Card class="p-6">
            <h3 class="text-lg font-semibold text-ccb-gray-dark mb-3">
              Registro de Visitantes
            </h3>
            <p class="text-sm text-ccb-gray mb-4">
              Ver y gestionar visitantes registrados
            </p>
            <Button variant="secondary" class="w-full">
              Ver Visitantes
            </Button>
          </Card>
        )}

        {permissions.hasPermission(PERMISSIONS.VIEW_REPORTS) && (
          <Card class="p-6">
            <h3 class="text-lg font-semibold text-ccb-gray-dark mb-3">
              Reportes y Estadísticas
            </h3>
            <p class="text-sm text-ccb-gray mb-4">
              Análisis detallado de actividades
            </p>
            <Button variant="outline" class="w-full">
              Ver Reportes
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
