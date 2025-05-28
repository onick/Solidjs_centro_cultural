import { createSignal, onMount, For, Show } from 'solid-js';
import { A } from '@solidjs/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { eventService } from '../services/api';
import { formatDate } from '../utils/dateHelpers';

function Home() {
  const [featuredEvents, setFeaturedEvents] = createSignal([]);
  const [upcomingEvents, setUpcomingEvents] = createSignal([]);
  const [statistics, setStatistics] = createSignal({
    totalEvents: 0,
    totalVisitors: 0,
    activeEvents: 0,
    categories: []
  });
  const [loading, setLoading] = createSignal(true);

  onMount(async () => {
    await loadHomeData();
  });

  const loadHomeData = async () => {
    setLoading(true);
    try {
      // Cargar eventos destacados
      const eventsResponse = await eventService.getAll();
      const allEvents = eventsResponse.data.events || [];
      
      // Filtrar eventos destacados y próximos
      const now = new Date();
      const featured = allEvents
        .filter(event => event.featured && new Date(event.startDate) > now)
        .slice(0, 3);
      
      const upcoming = allEvents
        .filter(event => new Date(event.startDate) > now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 6);
      
      setFeaturedEvents(featured);
      setUpcomingEvents(upcoming);

      // Cargar estadísticas
      const statsResponse = await fetch('http://localhost:3080/api/stats');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        setStatistics(stats);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Exposición': '🎨',
      'Concierto': '🎵',
      'Teatro': '🎭',
      'Conferencia': '🎤',
      'Taller': '🛠️',
      'Cine': '🎬',
      'Literatura': '📚',
      'Danza': '💃'
    };
    return icons[category] || '🎯';
  };

  return (
    <Layout>
      <div class="home-page">
        {/* Hero Section Mejorado */}
        <section class="hero-section bg-gradient-to-r from-ccb-orange to-ccb-blue text-white py-20">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h1 class="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                Centro Cultural Banreservas
              </h1>
              <p class="text-xl md:text-2xl mb-8 opacity-90">
                Un espacio donde el arte y la cultura cobran vida
              </p>
              <div class="flex gap-4 justify-center">
                <A href="/eventos">
                  <Button variant="white" size="large" class="hover:scale-105 transition-transform">
                    Explorar Eventos
                  </Button>
                </A>
                <A href="/registro">
                  <Button variant="outline-white" size="large" class="hover:scale-105 transition-transform">
                    Registrarse
                  </Button>
                </A>
              </div>
            </div>
          </div>
        </section>

        {/* Estadísticas Rápidas */}
        <section class="py-12 bg-gray-50">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="bg-white rounded-lg p-6 text-center shadow-sm">
                <div class="text-4xl font-bold text-ccb-orange mb-2">
                  {statistics().totalEvents}
                </div>
                <div class="text-gray-600">Eventos Totales</div>
              </div>
              <div class="bg-white rounded-lg p-6 text-center shadow-sm">
                <div class="text-4xl font-bold text-ccb-blue mb-2">
                  {statistics().activeEvents}
                </div>
                <div class="text-gray-600">Eventos Activos</div>
              </div>
              <div class="bg-white rounded-lg p-6 text-center shadow-sm">
                <div class="text-4xl font-bold text-ccb-orange mb-2">
                  {statistics().totalVisitors}
                </div>
                <div class="text-gray-600">Visitantes Registrados</div>
              </div>
              <div class="bg-white rounded-lg p-6 text-center shadow-sm">
                <div class="text-4xl font-bold text-ccb-blue mb-2">
                  {statistics().categories?.length || 0}
                </div>
                <div class="text-gray-600">Categorías</div>
              </div>
            </div>
          </div>
        </section>

        {/* Eventos Destacados */}
        <Show when={!loading()} fallback={
          <div class="container mx-auto px-4 py-12">
            <div class="text-center">
              <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ccb-orange"></div>
              <p class="mt-4 text-gray-600">Cargando eventos...</p>
            </div>
          </div>
        }>
          <Show when={featuredEvents().length > 0}>
            <section class="py-16 bg-white">
              <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12 text-ccb-gray">
                  Eventos Destacados
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <For each={featuredEvents()}>
                    {(event) => (
                      <div class="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                        <div class="aspect-w-16 aspect-h-9 bg-gradient-to-br from-ccb-orange to-ccb-blue">
                          <Show when={event.image} fallback={
                            <div class="flex items-center justify-center h-64 text-white text-6xl">
                              {getCategoryIcon(event.category)}
                            </div>
                          }>
                            <img src={event.image} alt={event.title} class="w-full h-64 object-cover" />
                          </Show>
                        </div>
                        <div class="absolute top-4 right-4 bg-ccb-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
                          DESTACADO
                        </div>
                        <div class="p-6">
                          <h3 class="text-xl font-bold mb-2 text-ccb-gray group-hover:text-ccb-orange transition-colors">
                            {event.title}
                          </h3>
                          <p class="text-gray-600 mb-4 line-clamp-2">
                            {event.description}
                          </p>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-500">
                              {formatDate(event.startDate)}
                            </span>
                            <A href={`/eventos/${event._id}`}>
                              <Button variant="primary" size="small">
                                Ver más
                              </Button>
                            </A>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </section>
          </Show>

          {/* Próximos Eventos */}
          <Show when={upcomingEvents().length > 0}>
            <section class="py-16 bg-gray-50">
              <div class="container mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-12 text-ccb-gray">
                  Próximos Eventos
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <For each={upcomingEvents()}>
                    {(event) => (
                      <Card 
                        title={event.title} 
                        variant="event"
                        class="hover:transform hover:scale-105 transition-transform"
                      >
                        <div class="space-y-3">
                          <div class="flex items-center gap-2">
                            <span class="text-2xl">{getCategoryIcon(event.category)}</span>
                            <span class="text-sm font-medium text-ccb-blue">{event.category}</span>
                          </div>
                          <p class="text-gray-600 text-sm line-clamp-2">
                            {event.description}
                          </p>
                          <div class="flex items-center justify-between pt-2">
                            <div class="text-sm">
                              <div class="text-gray-500">Fecha:</div>
                              <div class="font-medium">{formatDate(event.startDate)}</div>
                            </div>
                            <A href={`/eventos/${event._id}`}>
                              <Button variant="outline" size="small">
                                Detalles
                              </Button>
                            </A>
                          </div>
                          <Show when={event.capacity}>
                            <div class="bg-gray-100 rounded-lg p-2 text-center">
                              <span class="text-sm text-gray-600">
                                {event.registeredCount || 0} / {event.capacity} cupos
                              </span>
                            </div>
                          </Show>
                        </div>
                      </Card>
                    )}
                  </For>
                </div>
                <div class="text-center mt-8">
                  <A href="/eventos">
                    <Button variant="primary" size="large">
                      Ver Todos los Eventos
                    </Button>
                  </A>
                </div>
              </div>
            </section>
          </Show>
        </Show>

        {/* Categorías */}
        <section class="py-16 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12 text-ccb-gray">
              Explora por Categoría
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <For each={[
                { name: 'Exposición', icon: '🎨', color: 'from-purple-400 to-pink-400' },
                { name: 'Concierto', icon: '🎵', color: 'from-blue-400 to-indigo-400' },
                { name: 'Teatro', icon: '🎭', color: 'from-green-400 to-teal-400' },
                { name: 'Conferencia', icon: '🎤', color: 'from-yellow-400 to-orange-400' },
                { name: 'Taller', icon: '🛠️', color: 'from-red-400 to-pink-400' },
                { name: 'Cine', icon: '🎬', color: 'from-indigo-400 to-purple-400' },
                { name: 'Literatura', icon: '📚', color: 'from-teal-400 to-green-400' },
                { name: 'Danza', icon: '💃', color: 'from-orange-400 to-red-400' }
              ]}>
                {(category) => (
                  <A href={`/eventos?categoria=${category.name}`}>
                    <div class={`bg-gradient-to-br ${category.color} rounded-lg p-6 text-center text-white hover:shadow-lg transition-all hover:scale-105 cursor-pointer`}>
                      <div class="text-4xl mb-2">{category.icon}</div>
                      <div class="font-semibold">{category.name}</div>
                    </div>
                  </A>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section class="py-20 bg-gradient-to-r from-ccb-blue to-ccb-orange text-white">
          <div class="container mx-auto px-4 text-center">
            <h2 class="text-4xl font-bold mb-6">
              ¿Listo para vivir la cultura?
            </h2>
            <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Regístrate hoy y recibe notificaciones sobre los eventos que más te interesan.
              ¡No te pierdas ninguna experiencia cultural!
            </p>
            <div class="flex gap-4 justify-center">
              <A href="/registro">
                <Button variant="white" size="large" class="hover:scale-105 transition-transform">
                  Registrarse Ahora
                </Button>
              </A>
              <A href="/eventos">
                <Button variant="outline-white" size="large" class="hover:scale-105 transition-transform">
                  Ver Calendario
                </Button>
              </A>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default Home;