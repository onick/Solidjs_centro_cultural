import { createStore } from 'solid-js/store';

// Estado de eventos
const [eventStore, setEventStore] = createStore({
  events: [],
  selectedEvent: null,
  isLoading: false,
  filters: {
    status: 'all',
    type: 'all',
    date: null,
  },
  lastUpdated: null,
});

// Acciones para eventos
export const eventActions = {
  // Cargar eventos
  setEvents: (events) => {
    setEventStore('events', events);
    setEventStore('lastUpdated', new Date());
  },
  
  // Agregar evento
  addEvent: (event) => {
    setEventStore('events', (events) => [...events, event]);
  },
  
  // Actualizar evento
  updateEvent: (id, updates) => {
    setEventStore('events', (event) => 
      event.id === id, updates
    );
  },
  
  // Eliminar evento
  removeEvent: (id) => {
    setEventStore('events', (events) => 
      events.filter(event => event.id !== id)
    );
  },
  
  // Seleccionar evento
  selectEvent: (event) => setEventStore('selectedEvent', event),
  clearSelection: () => setEventStore('selectedEvent', null),
  
  // Estados de carga
  setLoading: (loading) => setEventStore('isLoading', loading),
  
  // Filtros
  setFilter: (key, value) => setEventStore('filters', key, value),
  clearFilters: () => setEventStore('filters', {
    status: 'all',
    type: 'all',
    date: null,
  }),
};

export default eventStore;
