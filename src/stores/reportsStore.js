import { createStore } from 'solid-js/store';
import { createSignal } from 'solid-js';

// Store para gestión de reportes y estadísticas
const [reportsState, setReportsState] = createStore({
  dashboardStats: null,
  eventsReport: null,
  visitorsReport: null,
  financialReport: null,
  loading: false,
  error: null
});

const [isLoading, setIsLoading] = createSignal(false);

const reportsStore = {
  // Getters
  get dashboardStats() { return reportsState.dashboardStats; },
  get eventsReport() { return reportsState.eventsReport; },
  get visitorsReport() { return reportsState.visitorsReport; },
  get loading() { return reportsState.loading; },
  get error() { return reportsState.error; },

  // Actions
  async loadDashboardStats() {
    setReportsState('loading', true);
    setReportsState('error', null);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/dashboard`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas del dashboard');
      }

      const data = await response.json();
      setReportsState('dashboardStats', data.stats);
    } catch (error) {
      console.error('Error cargando estadísticas del dashboard:', error);
      setReportsState('error', error.message);
    } finally {
      setReportsState('loading', false);
    }
  },

  async loadEventsReport(filters = {}) {
    setReportsState('loading', true);
    setReportsState('error', null);
    
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/events?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar reporte de eventos');
      }

      const data = await response.json();
      setReportsState('eventsReport', data.report);
    } catch (error) {
      console.error('Error cargando reporte de eventos:', error);
      setReportsState('error', error.message);
    } finally {
      setReportsState('loading', false);
    }
  },

  async loadVisitorsReport(filters = {}) {
    setReportsState('loading', true);
    setReportsState('error', null);
    
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/visitors?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar reporte de visitantes');
      }

      const data = await response.json();
      setReportsState('visitorsReport', data.report);
    } catch (error) {
      console.error('Error cargando reporte de visitantes:', error);
      setReportsState('error', error.message);
    } finally {
      setReportsState('loading', false);
    }
  },

  async exportReport(type, format, filters = {}) {
    try {
      const queryParams = new URLSearchParams({ 
        ...filters, 
        format 
      }).toString();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reports/${type}/export?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al exportar reporte');
      }

      // Descargar archivo
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${type}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando reporte:', error);
      throw error;
    }
  }
};

export { reportsStore };
