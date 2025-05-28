import { createSignal, onMount, For } from 'solid-js';
import { A } from '@solidjs/router';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import eventStore, { eventActions } from '../stores/eventStore';

function Events() {
  const [searchTerm, setSearchTerm] = createSignal('');
  const [filterType, setFilterType] = createSignal('all');

  onMount(async () => {
    await loadEvents();
  });

  const loadEvents = async () => {
    eventActions.setLoading(true);
    try {
      // Intentar cargar desde nuestro backend
      const response = await fetch('http://localhost:3080/api/events');
      if (response.ok) {
        const events = await response.json();
        eventActions.setEvents(events);
      } else {
        // Fallback al sistema Vue.js
        const vueResponse = await fetch('http://localhost:8080/api/v1/events');
        if (vueResponse.ok) {
          const vueEvents = await vueResponse.json();
          eventActions.setEvents(vueEvents);
        }
      }
    } catch (error) {
      console.error('Error cargando eventos:', error);
      // Cargar eventos de ejemplo
      loadSampleEvents();
    } finally {
      eventActions.setLoading(false);
    }
  };

  const loadSampleEvents = () => {
    const sampleEvents = [
      {
        id: 1,
        title: 'Exposición de Arte Dominicano',
        description: 'Muestra de artistas contemporáneos dominicanos',
        type: 'exposicion',
        date: '2025-05-30',
        status: 'active',
        image: '/images/expo-arte.jpg'
      },
      {
        id: 2,
        title: 'Concierto de Piano',
        description: 'Recital de música clásica y contemporánea',
        type: 'concierto',
        date: '2025-06-02',
        status: 'active',
        image: '/images/concierto-piano.jpg'
      }
    ];
    eventActions.setEvents(sampleEvents);
  };

  const filteredEvents = () => {
    let events = eventStore.events;
    
    // Filtrar por búsqueda
    if (searchTerm()) {
      events = events.filter(event => 
        event.title.toLowerCase().includes(searchTerm().toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm().toLowerCase())
      );
    }
    
    // Filtrar por tipo
    if (filterType() !== 'all') {
      events = events.filter(event => event.type === filterType());
    }
    
    return events;
  };

  return (
    <Layout>
      <div class="events-page">
        <div class="page-header">
          <h1>🎭 Eventos Culturales</h1>
          <p>Descubre nuestra programación cultural</p>
        </div>

        {/* Filtros y Búsqueda */}
        <div class="events-filters">
          <div class="search-box">
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm()}
              onInput={(e) => setSearchTerm(e.target.value)}
              class="search-input"
            />
          </div>
          
          <div class="filter-select">
            <select
              value={filterType()}
              onChange={(e) => setFilterType(e.target.value)}
              class="filter-dropdown"
            >
              <option value="all">Todos los tipos</option>
              <option value="exposicion">Exposiciones</option>
              <option value="concierto">Conciertos</option>
              <option value="taller">Talleres</option>
              <option value="conferencia">Conferencias</option>
            </select>
          </div>
        </div>

        {/* Lista de Eventos */}
        <div class="events-grid">
          {eventStore.isLoading ? (
            <div class="loading-message">
              <p>⏳ Cargando eventos...</p>
            </div>
          ) : (
            <For each={filteredEvents()}>
              {(event) => (
                <Card
                  title={event.title}
                  subtitle={`${event.type} • ${event.date}`}
                  image={event.image}
                  variant="event"
                  hover={true}
                  clickable={true}
                >
                  <p class="event-description">{event.description}</p>
                  
                  <div class="event-actions">
                    <A href={`/eventos/${event.id}`}>
                      <Button variant="primary" size="small">
                        Ver Detalles
                      </Button>
                    </A>
                    
                    <A href={`/registro?event=${event.id}`}>
                      <Button variant="secondary" size="small">
                        Registrarse
                      </Button>
                    </A>
                  </div>
                </Card>
              )}
            </For>
          )}
        </div>

        {/* Estado vacío */}
        {!eventStore.isLoading && filteredEvents().length === 0 && (
          <div class="empty-state">
            <h3>No se encontraron eventos</h3>
            <p>Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Events;
