import { createSignal, onMount, Show } from 'solid-js';
import { useParams, A } from '@solidjs/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { eventService } from '../services/api';
import { formatDateTime, getDaysUntil, getRelativeTime } from '../utils/dateHelpers';

function EventDetails() {
  const params = useParams();
  const [event, setEvent] = createSignal(null);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [registering, setRegistering] = createSignal(false);

  onMount(async () => {
    await loadEvent();
  });

  const loadEvent = async () => {
    try {
      const response = await eventService.getById(params.id);
      setEvent(response.data.event);
    } catch (err) {
      setError('Error al cargar el evento');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await eventService.register(params.id);
      // Recargar evento para actualizar contador
      await loadEvent();
      alert('¡Te has registrado exitosamente!');
    } catch (err) {
      alert('Error al registrarse: ' + err.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <Layout>
      <div class="event-details-page">
        <Show when={loading()}>
          <div class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-ccb-orange"></div>
            <p class="mt-4 text-gray-600">Cargando evento...</p>
          </div>
        </Show>

        <Show when={error()}>
          <div class="text-center py-12">
            <p class="text-red-500 text-xl">{error()}</p>
            <A href="/eventos" class="mt-4 inline-block">
              <Button variant="primary">Volver a Eventos</Button>
            </A>
          </div>
        </Show>

        <Show when={event() && !loading()}>
          <div class="max-w-4xl mx-auto">
            {/* Navegación */}
            <div class="mb-6">
              <A href="/eventos" class="text-ccb-blue hover:text-ccb-orange transition-colors">
                ← Volver a Eventos
              </A>
            </div>

            {/* Imagen del evento */}
            <div class="relative h-96 bg-gradient-to-br from-ccb-orange to-ccb-blue rounded-lg overflow-hidden mb-8">
              <Show when={event().image} fallback={
                <div class="flex items-center justify-center h-full text-white text-8xl">
                  {event().category === 'Exposición' && '🎨'}
                  {event().category === 'Concierto' && '🎵'}
                  {event().category === 'Teatro' && '🎭'}
                  {event().category === 'Conferencia' && '🎤'}
                  {event().category === 'Taller' && '🛠️'}
                </div>
              }>
                <img src={event().image} alt={event().title} class="w-full h-full object-cover" />
              </Show>
              <Show when={event().featured}>
                <div class="absolute top-4 right-4 bg-ccb-orange text-white px-4 py-2 rounded-full font-semibold">
                  EVENTO DESTACADO
                </div>
              </Show>
            </div>

            {/* Información principal */}
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2">
                <h1 class="text-4xl font-bold text-ccb-gray mb-4">{event().title}</h1>
                
                <div class="flex flex-wrap gap-4 mb-6">
                  <span class="bg-ccb-blue text-white px-4 py-2 rounded-full text-sm">
                    {event().category}
                  </span>
                  <span class="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">
                    {getRelativeTime(event().startDate)}
                  </span>
                  <Show when={event().status === 'published'}>
                    <span class="bg-green-500 text-white px-4 py-2 rounded-full text-sm">
                      Activo
                    </span>
                  </Show>
                </div>

                <div class="prose max-w-none mb-8">
                  <h3 class="text-xl font-semibold mb-3">Descripción</h3>
                  <p class="text-gray-700 whitespace-pre-wrap">{event().description}</p>
                </div>

                <Show when={event().requirements}>
                  <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-3">Requisitos</h3>
                    <p class="text-gray-700">{event().requirements}</p>
                  </div>
                </Show>
              </div>

              <div class="lg:col-span-1">
                <Card title="Detalles del Evento" variant="info">
                  <div class="space-y-4">
                    <div>
                      <span class="text-gray-500 text-sm">Fecha y Hora</span>
                      <p class="font-medium">{formatDateTime(event().startDate)}</p>
                    </div>
                    
                    <Show when={event().location}>
                      <div>
                        <span class="text-gray-500 text-sm">Ubicación</span>
                        <p class="font-medium">{event().location}</p>
                      </div>
                    </Show>

                    <Show when={event().duration}>
                      <div>
                        <span class="text-gray-500 text-sm">Duración</span>
                        <p class="font-medium">{event().duration} minutos</p>
                      </div>
                    </Show>

                    <Show when={event().capacity}>
                      <div>
                        <span class="text-gray-500 text-sm">Cupos</span>
                        <div class="mt-1">
                          <div class="bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div 
                              class="bg-ccb-orange h-full transition-all"
                              style={`width: ${(event().registeredCount / event().capacity) * 100}%`}
                            ></div>
                          </div>
                          <p class="text-sm mt-1">
                            {event().registeredCount || 0} / {event().capacity} registrados
                          </p>
                        </div>
                      </div>
                    </Show>

                    <Show when={event().price}>
                      <div>
                        <span class="text-gray-500 text-sm">Precio</span>
                        <p class="font-medium text-lg text-ccb-orange">
                          ${event().price} DOP
                        </p>
                      </div>
                    </Show>

                    <div class="pt-4">
                      <Button 
                        variant="primary" 
                        size="large" 
                        class="w-full"
                        onClick={handleRegister}
                        loading={registering()}
                        disabled={event().registeredCount >= event().capacity}
                      >
                        {event().registeredCount >= event().capacity 
                          ? 'Evento Lleno' 
                          : 'Registrarse'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Show>
      </div>
    </Layout>
  );
}

export default EventDetails;