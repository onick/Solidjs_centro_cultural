import { createSignal, createResource, For } from 'solid-js';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Función para obtener eventos del backend
async function fetchEvents() {
  try {
    const response = await fetch('http://localhost:3080/api/events');
    if (!response.ok) {
      throw new Error('Error al cargar eventos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    // Datos de ejemplo si el backend no está disponible
    return [
      {
        id: 1,
        title: "Exposición de Arte Dominicano",
        description: "Una muestra del mejor arte contemporáneo dominicano",
        start_date: "2025-06-01",
        end_date: "2025-06-15",
        location: "Sala Principal",
        type: "exposicion",
        is_active: true,
        registered_count: 45,
        checked_in_count: 32
      },
      {
        id: 2,
        title: "Concierto de Piano",
        description: "Presentación de música clásica y contemporánea",
        start_date: "2025-06-05",
        end_date: "2025-06-05",
        location: "Auditorio",
        type: "concierto",
        is_active: true,
        registered_count: 120,
        checked_in_count: 98
      },
      {
        id: 3,
        title: "Taller de Literatura",
        description: "Aprende técnicas de escritura creativa",
        start_date: "2025-06-10",
        end_date: "2025-06-12",
        location: "Aula 2",
        type: "taller",
        is_active: true,
        registered_count: 25,
        checked_in_count: 20
      }
    ];
  }
}

// Función para obtener el emoji según el tipo de evento
function getEventEmoji(type) {
  const emojis = {
    exposicion: "🎨",
    concierto: "🎵",
    taller: "📚",
    charla: "💬",
    cine: "🎬",
    presentacion: "🎪"
  };
  return emojis[type] || "🎭";
}

// Función para obtener el estado visual del evento
function getEventStatus(event) {
  const today = new Date();
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  
  if (today < startDate) {
    return { text: "Próximo", class: "bg-yellow-500 text-white" };
  } else if (today > endDate) {
    return { text: "Finalizado", class: "bg-gray-500 text-white" };
  } else {
    return { text: "Activo", class: "bg-green-500 text-white" };
  }
}

function EventosPage() {
  const [events] = createResource(fetchEvents);
  const [filter, setFilter] = createSignal('all');

  const filteredEvents = () => {
    const eventList = events() || [];
    if (filter() === 'all') return eventList;
    if (filter() === 'active') return eventList.filter(e => e.is_active);
    return eventList.filter(e => e.type === filter());
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-gradient-to-r from-orange-500 to-blue-500 text-white py-12">
        <div class="container mx-auto px-4">
          <h1 class="text-5xl font-bold mb-2">Eventos Culturales</h1>
          <p class="text-xl opacity-90">Descubre nuestra programación</p>
        </div>
      </header>

      {/* Filtros */}
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-wrap gap-4 mb-8">
          <Button 
            variant={filter() === 'all' ? 'primary' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant={filter() === 'active' ? 'primary' : 'outline'}
            onClick={() => setFilter('active')}
          >
            Activos
          </Button>
          <Button 
            variant={filter() === 'exposicion' ? 'primary' : 'outline'}
            onClick={() => setFilter('exposicion')}
          >
            🎨 Exposiciones
          </Button>
          <Button 
            variant={filter() === 'concierto' ? 'primary' : 'outline'}
            onClick={() => setFilter('concierto')}
          >
            🎵 Conciertos
          </Button>
          <Button 
            variant={filter() === 'taller' ? 'primary' : 'outline'}
            onClick={() => setFilter('taller')}
          >
            📚 Talleres
          </Button>
        </div>

        {/* Grid de eventos */}
        {events.loading && (
          <div class="text-center py-12">
            <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando eventos...</p>
          </div>
        )}

        {events.error && (
          <div class="text-center py-12">
            <p class="text-red-600 mb-4">Error al cargar eventos</p>
            <Button onClick={() => events.refetch()}>Reintentar</Button>
          </div>
        )}

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={filteredEvents()}>
            {(event) => {
              const status = getEventStatus(event);
              return (
                <Card
                  title={event.title}
                  subtitle={event.description}
                  image={getEventEmoji(event.type)}
                  badge={status.text}
                  badgeClass={status.class}
                  footer={
                    <div class="space-y-4">
                      <div class="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span class="font-semibold">📅 Inicio:</span>
                          <p>{new Date(event.start_date).toLocaleDateString('es-DO')}</p>
                        </div>
                        <div>
                          <span class="font-semibold">📍 Lugar:</span>
                          <p>{event.location}</p>
                        </div>
                      </div>
                      
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-green-600">
                          ✅ {event.registered_count || 0} registrados
                        </span>
                        <span class="text-blue-600">
                          👥 {event.checked_in_count || 0} asistentes
                        </span>
                      </div>
                      
                      <div class="flex gap-2">
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => {/* TODO: Implementar registro */}}
                        >
                          Registrarse
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {/* TODO: Ver detalles */}}
                        >
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  }
                >
                  <div class="text-gray-600 text-sm">
                    <p><strong>Tipo:</strong> {event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                    <p><strong>Duración:</strong> {event.start_date === event.end_date ? 'Un día' : `${event.start_date} - ${event.end_date}`}</p>
                  </div>
                </Card>
              );
            }}
          </For>
        </div>

        {filteredEvents()?.length === 0 && !events.loading && (
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🎭</div>
            <h3 class="text-xl font-semibold text-gray-600 mb-2">No hay eventos disponibles</h3>
            <p class="text-gray-500">Prueba con un filtro diferente</p>
          </div>
        )}
      </div>

      {/* Back to home */}
      <div class="container mx-auto px-4 pb-8">
        <Button variant="ghost" onClick={() => window.history.back()}>
          ← Volver al inicio
        </Button>
      </div>
    </div>
  );
}

export default EventosPage;