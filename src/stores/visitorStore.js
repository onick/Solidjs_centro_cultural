import { createStore } from 'solid-js/store';

// Estado de visitantes
const [visitorStore, setVisitorStore] = createStore({
  visitors: [],
  registrations: [],
  checkins: [],
  isLoading: false,
  stats: {
    totalVisitors: 0,
    todayRegistrations: 0,
    todayCheckins: 0,
  },
  lastUpdated: null,
});

// Acciones para visitantes
export const visitorActions = {
  // Visitantes
  setVisitors: (visitors) => {
    setVisitorStore('visitors', visitors);
    setVisitorStore('lastUpdated', new Date());
  },
  
  addVisitor: (visitor) => {
    setVisitorStore('visitors', (visitors) => [...visitors, visitor]);
  },
  
  // Registros
  setRegistrations: (registrations) => {
    setVisitorStore('registrations', registrations);
  },
  
  addRegistration: (registration) => {
    setVisitorStore('registrations', (regs) => [...regs, registration]);
  },
  
  // Check-ins
  addCheckin: (checkin) => {
    setVisitorStore('checkins', (checkins) => [...checkins, checkin]);
  },
  
  // Estadísticas
  updateStats: (stats) => {
    setVisitorStore('stats', { ...visitorStore.stats, ...stats });
  },
  
  // Estados
  setLoading: (loading) => setVisitorStore('isLoading', loading),
};

export default visitorStore;
