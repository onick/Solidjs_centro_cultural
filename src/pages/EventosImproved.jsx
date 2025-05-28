import { createSignal, createResource, For, Show } from 'solid-js';
import { A } from '@solidjs/router';
import Layout from '../components/Layout';

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
    // Datos de ejemplo mejorados
    return [
      {
        id: 1,
        title: "Concierto de Piano",
        description: "Presentación de música clásica y contemporánea por reconocidos pianistas",
        start_date: "2025-05-29",
        end_date: "2025-05-29",
        start_time: "20:00",
        end_time: "22:00",
        location: "Auditorio Principal",
        type: "concierto",
        is_active: true,
        status: "PENDIENTE",
        registered_count: 45,
        checked_in_count: 32,
        capacity: 150,
        image: "🎹"
      },
      {
        id: 2,
        title: "Taller de Literatura",
        description: "Aprende técnicas avanzadas de escritura creativa con autores reconocidos",
        start_date: "2025-05-31",
        end_date: "2025-05-31",
        start_time: "09:00",
        end_time: "17:00",
        location: "Aula 1",
        type: "taller",
        is_active: true,
        status: "PENDIENTE",
        registered_count: 20,
        checked_in_count: 12,
        capacity: 30,
        image: "📚"
      },
      {
        id: 3,
        title: "Taller de TEATRO 2025",
        description: "Técnicas de actuación y expresión teatral para principiantes y avanzados",
        start_date: "2025-05-29",
        end_date: "2025-05-29",
        start_time: "14:34",
        end_time: "17:34",
        location: "Sala Principal del Centro Cultural",
        type: "taller",
        is_active: true,
        status: "FINALIZADO",
        registered_count: 0,
        checked_in_count: 0,
        capacity: 25,
        image: "🎭"
      }
    ];
  }
}
function EventosImproved() {
  const [events] = createResource(fetchEvents);
  const [filter, setFilter] = createSignal('todos');

  const filteredEvents = () => {
    const eventsList = events() || [];
    if (filter() === 'todos') return eventsList;
    
    switch (filter()) {
      case 'proximos':
        return eventsList.filter(event => 
          new Date(event.start_date) >= new Date() && event.status !== 'FINALIZADO'
        );
      case 'en-curso':
        return eventsList.filter(event => 
          event.status === 'PENDIENTE' && event.is_active
        );
      case 'finalizados':
        return eventsList.filter(event => 
          event.status === 'FINALIZADO'
        );
      default:
        return eventsList;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'FINALIZADO':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'concierto': return '🎵';
      case 'taller': return '🎨';
      case 'exposicion': return '🖼️';
      case 'conferencia': return '🎤';
      default: return '🎭';
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      {/* Header con navegación */}
      <header class="bg-gradient-to-r from-[#00BDF2] to-[#F99D2A] shadow-2xl">
        <div class="container mx-auto px-6 py-6">
          <div class="flex items-center justify-between mb-6">
            <A href="/" class="flex items-center space-x-4 hover:opacity-90 transition-opacity">
              <div class="bg-white rounded-full p-3 shadow-lg">
                <div class="text-xl font-bold text-[#00BDF2]">CCB</div>
              </div>
              <div class="text-white">
                <h1 class="text-2xl font-bold">Centro Cultural Banreservas</h1>
                <p class="text-sm opacity-90">Eventos Culturales</p>
              </div>
            </A>
            <div class="text-white text-right">
              <div class="text-lg opacity-90">Eventos</div>
              <div class="text-sm">{new Date().toLocaleDateString('es-DO')}</div>
            </div>
          </div>

          {/* Filtros de eventos */}
          <div class="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('todos')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter() === 'todos' 
                  ? 'bg-white text-[#00BDF2] shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Todos
            </button>            <button
              onClick={() => setFilter('proximos')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter() === 'proximos' 
                  ? 'bg-white text-[#00BDF2] shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Próximos
            </button>
            <button
              onClick={() => setFilter('en-curso')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter() === 'en-curso' 
                  ? 'bg-white text-[#00BDF2] shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              En Curso
            </button>
            <button
              onClick={() => setFilter('finalizados')}
              class={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter() === 'finalizados' 
                  ? 'bg-white text-[#00BDF2] shadow-lg' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Finalizados
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main class="container mx-auto px-6 py-8">
        <Show when={events.loading}>
          <div class="text-center py-12">
            <div class="w-16 h-16 border-4 border-[#00BDF2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-600">Cargando eventos...</p>
          </div>
        </Show>

        <Show when={events.error}>
          <div class="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <div class="text-4xl mb-4">⚠️</div>
            <h3 class="text-lg font-semibold text-red-800 mb-2">Error al cargar eventos</h3>
            <p class="text-red-600">Mostrando datos de ejemplo</p>
          </div>
        </Show>

        <Show when={!events.loading && !events.error}>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <For each={filteredEvents()}>
              {(event) => (
                <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  {/* Header del evento */}
                  <div class="bg-gradient-to-r from-[#00BDF2] to-[#F99D2A] p-6 text-white">
                    <div class="flex items-center justify-between mb-4">
                      <div class="text-3xl">{event.image || getTypeIcon(event.type)}</div>
                      <span class={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    <h3 class="text-xl font-bold mb-2">{event.title}</h3>
                    <p class="text-white/90 text-sm">{event.description}</p>
                  </div>
                  {/* Información del evento */}
                  <div class="p-6">
                    <div class="space-y-3 mb-6">
                      <div class="flex items-center text-gray-600">
                        <span class="mr-3">📅</span>
                        <span class="text-sm">
                          {new Date(event.start_date).toLocaleDateString('es-DO')}
                          {event.start_time && ` • ${event.start_time}`}
                        </span>
                      </div>
                      <div class="flex items-center text-gray-600">
                        <span class="mr-3">📍</span>
                        <span class="text-sm">{event.location}</span>
                      </div>
                      <div class="flex items-center text-gray-600">
                        <span class="mr-3">👥</span>
                        <span class="text-sm">
                          {event.registered_count}/{event.capacity} registrados
                        </span>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div class="grid grid-cols-2 gap-4 mb-6">
                      <div class="bg-orange-50 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-[#F99D2A]">
                          {event.registered_count}
                        </div>
                        <div class="text-xs text-gray-600">Registrados</div>
                      </div>
                      <div class="bg-blue-50 rounded-lg p-3 text-center">
                        <div class="text-2xl font-bold text-[#00BDF2]">
                          {event.checked_in_count}
                        </div>
                        <div class="text-xs text-gray-600">Check-ins</div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    <div class="flex space-x-3">
                      <A 
                        href={`/registro?evento=${event.id}`}
                        class="flex-1 bg-gradient-to-r from-[#F99D2A] to-[#FB923C] text-white py-2 px-4 rounded-lg text-center text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Registrarse
                      </A>
                      <A 
                        href={`/checkin?evento=${event.id}`}
                        class="flex-1 bg-gradient-to-r from-[#00BDF2] to-[#0EA5E9] text-white py-2 px-4 rounded-lg text-center text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Check-in
                      </A>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>

        <Show when={!events.loading && filteredEvents()?.length === 0}>
          <div class="text-center py-12">
            <div class="text-6xl mb-4">🎭</div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">No hay eventos disponibles</h3>
            <p class="text-gray-600 mb-6">No se encontraron eventos para el filtro seleccionado</p>
            <A 
              href="/" 
              class="bg-gradient-to-r from-[#00BDF2] to-[#F99D2A] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Volver al inicio
            </A>
          </div>
        </Show>
      </main>
    </div>
  );
}

export default EventosImproved;