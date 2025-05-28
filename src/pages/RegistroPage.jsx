import { createSignal, createResource, For, Show } from 'solid-js';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

// Función para obtener eventos activos
async function fetchActiveEvents() {
  try {
    const response = await fetch('http://localhost:3080/api/events?active=true');
    if (!response.ok) {
      throw new Error('Error al cargar eventos');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    // Datos de ejemplo
    return [
      {
        id: 1,
        title: "Exposición de Arte Dominicano",
        description: "Una muestra del mejor arte contemporáneo dominicano",
        start_date: "2025-06-01",
        location: "Sala Principal",
        type: "exposicion"
      },
      {
        id: 2,
        title: "Concierto de Piano",
        description: "Presentación de música clásica y contemporánea", 
        start_date: "2025-06-05",
        location: "Auditorio",
        type: "concierto"
      }
    ];
  }
}

function RegistroPage() {
  const [events] = createResource(fetchActiveEvents); 
  const [selectedEvent, setSelectedEvent] = createSignal(null);
  const [formData, setFormData] = createSignal({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    event_id: null
  });
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [submitted, setSubmitted] = createSignal(false);
  const [registrationCode, setRegistrationCode] = createSignal('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    handleInputChange('event_id', event.id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3080/api/visitors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData())
      });
      
      if (!response.ok) {
        throw new Error('Error en el registro');
      }
      
      const result = await response.json();
      setRegistrationCode(result.registration_code || 'CCB' + Math.random().toString(36).substr(2, 6).toUpperCase());
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al registrarse. Por favor intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '', 
      email: '',
      phone: '',
      event_id: null
    });
    setSelectedEvent(null);
    setSubmitted(false);
    setRegistrationCode('');
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-gradient-to-r from-orange-500 to-blue-500 text-white py-12">
        <div class="container mx-auto px-4">
          <h1 class="text-5xl font-bold mb-2">Registro de Visitantes</h1>
          <p class="text-xl opacity-90">Regístrate para participar en nuestros eventos</p>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        <Show when={!submitted()} fallback={
          <div class="max-w-2xl mx-auto">
            <Card 
              title="¡Registro Exitoso! 🎉"
              class="text-center"
            >
              <div class="space-y-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 class="text-lg font-semibold text-green-800 mb-2">Tu código de registro:</h3>
                  <div class="text-3xl font-bold text-green-600 mb-4">{registrationCode()}</div>
                  <p class="text-green-700">Guarda este código para hacer check-in el día del evento</p>
                </div>
                
                <Show when={selectedEvent()}>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 class="font-semibold text-blue-800 mb-2">Evento seleccionado:</h4>
                    <p class="text-blue-700">{selectedEvent()?.title}</p>
                    <p class="text-blue-600 text-sm">{selectedEvent()?.location} - {new Date(selectedEvent()?.start_date).toLocaleDateString('es-DO')}</p>
                  </div>
                </Show>
                
                <div class="flex gap-4 justify-center">
                  <Button variant="primary" onClick={resetForm}>
                    Registrar otro visitante
                  </Button>
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Volver al inicio
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        }>
          <div class="max-w-4xl mx-auto">
            <div class="mb-8">
              <h2 class="text-2xl font-bold text-gray-800 mb-4">Selecciona un evento</h2>
              
              {events.loading && (
                <div class="text-center py-8">
                  <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p class="text-gray-600">Cargando eventos...</p>
                </div>
              )}
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <For each={events() || []}>
                  {(event) => (
                    <Card 
                      title={event.title}
                      subtitle={event.description}
                      class={`cursor-pointer transition-all ${selectedEvent()?.id === event.id ? 'ring-4 ring-blue-500 bg-blue-50' : 'hover:shadow-lg'}`}
                      onClick={() => handleEventSelect(event)}
                    >
                      <div class="text-sm text-gray-600 space-y-2">
                        <p><strong>📅 Fecha:</strong> {new Date(event.start_date).toLocaleDateString('es-DO')}</p>
                        <p><strong>📍 Lugar:</strong> {event.location}</p>
                        <p><strong>🎭 Tipo:</strong> {event.type.charAt(0).toUpperCase() + event.type.slice(1)}</p>
                      </div>
                    </Card>
                  )}
                </For>
              </div>
            </div>

            <Show when={selectedEvent()}>
              <Card title="Información del visitante" class="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData().first_name}
                        onInput={(e) => handleInputChange('first_name', e.target.value)}
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu nombre"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData().last_name}
                        onInput={(e) => handleInputChange('last_name', e.target.value)}
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tu apellido"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData().email}
                      onInput={(e) => handleInputChange('email', e.target.value)}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      value={formData().phone}
                      onInput={(e) => handleInputChange('phone', e.target.value)}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="(809) 000-0000"
                    />
                  </div>
                  
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-800 mb-2">Evento seleccionado:</h4>
                    <p class="text-blue-700">{selectedEvent()?.title}</p>
                    <p class="text-blue-600 text-sm">{selectedEvent()?.location} - {new Date(selectedEvent()?.start_date).toLocaleDateString('es-DO')}</p>
                  </div>
                  
                  <div class="flex gap-4">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      loading={isSubmitting()}
                      disabled={isSubmitting()}
                      class="flex-1"
                    >
                      {isSubmitting() ? 'Registrando...' : 'Completar Registro'}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setSelectedEvent(null)}
                    >
                      Cambiar evento
                    </Button>
                  </div>
                </form>
              </Card>
            </Show>
          </div>
        </Show>

        {/* Back button */}
        <div class="text-center mt-8">
          <Button variant="ghost" onClick={() => window.history.back()}>
            ← Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegistroPage;