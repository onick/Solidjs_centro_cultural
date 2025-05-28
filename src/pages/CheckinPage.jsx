import { createSignal, Show } from 'solid-js';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

function CheckinPage() {
  const [searchCode, setSearchCode] = createSignal('');
  const [isSearching, setIsSearching] = createSignal(false);
  const [visitor, setVisitor] = createSignal(null);
  const [events, setEvents] = createSignal([]);
  const [selectedEventId, setSelectedEventId] = createSignal(null);
  const [isCheckingIn, setIsCheckingIn] = createSignal(false);
  const [checkedIn, setCheckedIn] = createSignal(false);
  const [error, setError] = createSignal('');

  const searchVisitor = async () => {
    if (!searchCode().trim()) {
      setError('Por favor ingresa un código, email o teléfono');
      return;
    }

    setIsSearching(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3080/api/visitors/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: searchCode().trim()
        })
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No se encontró ningún visitante con ese código');
        } else {
          setError('Error al buscar visitante');
        }
        return;
      }
      
      const result = await response.json();
      setVisitor(result.visitor);
      setEvents(result.events || []);
      
      // Si solo hay un evento, seleccionarlo automáticamente
      if (result.events && result.events.length === 1) {
        setSelectedEventId(result.events[0].id);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Intente de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  const performCheckin = async () => {
    if (!selectedEventId()) {
      setError('Por favor selecciona un evento');
      return;
    }

    setIsCheckingIn(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3080/api/visitors/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitor_id: visitor().id,
          event_id: selectedEventId()
        })
      });
      
      if (!response.ok) {
        throw new Error('Error en el check-in');
      }
      
      setCheckedIn(true);
    } catch (error) {
      console.error('Error:', error);
      setError('Error al realizar check-in');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const resetSearch = () => {
    setSearchCode('');
    setVisitor(null);
    setEvents([]);
    setSelectedEventId(null);
    setCheckedIn(false);
    setError('');
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-gradient-to-r from-green-500 to-blue-500 text-white py-12">
        <div class="container mx-auto px-4">
          <h1 class="text-5xl font-bold mb-2">Check-in</h1>
          <p class="text-xl opacity-90">Confirma tu asistencia al evento</p>
        </div>
      </header>

      <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
          <Show when={!checkedIn()} fallback={
            <Card title="¡Check-in Exitoso! ✅" class="text-center">
              <div class="space-y-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div class="text-6xl mb-4">🎉</div>
                  <h3 class="text-xl font-semibold text-green-800 mb-2">
                    ¡Bienvenido {visitor()?.first_name}!
                  </h3>
                  <p class="text-green-700">Tu check-in ha sido registrado exitosamente</p>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 class="font-semibold text-blue-800 mb-2">Evento:</h4>
                  <p class="text-blue-700">
                    {events().find(e => e.id === selectedEventId())?.title}
                  </p>
                  <p class="text-blue-600 text-sm">
                    {events().find(e => e.id === selectedEventId())?.location}
                  </p>
                </div>
                
                <div class="flex gap-4 justify-center">
                  <Button variant="primary" onClick={resetSearch}>
                    Nuevo Check-in
                  </Button>
                  <Button variant="outline" onClick={() => window.history.back()}>
                    Volver al inicio
                  </Button>
                </div>
              </div>
            </Card>
          }>
            <Show when={!visitor()} fallback={
              <Card title="Visitante Encontrado" class="mb-6">
                <div class="space-y-6">
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 class="font-semibold text-blue-800 mb-2">Información del visitante:</h3>
                    <p class="text-blue-700">
                      <strong>Nombre:</strong> {visitor()?.first_name} {visitor()?.last_name}
                    </p>
                    <p class="text-blue-700">
                      <strong>Email:</strong> {visitor()?.email}
                    </p>
                    {visitor()?.phone && (
                      <p class="text-blue-700">
                        <strong>Teléfono:</strong> {visitor()?.phone}
                      </p>
                    )}
                  </div>
                  
                  <Show when={events().length > 0}>
                    <div>
                      <h4 class="font-semibold text-gray-800 mb-4">
                        Selecciona el evento para check-in:
                      </h4>
                      <div class="space-y-3">
                        {events().map(event => (
                          <div 
                            class={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedEventId() === event.id 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedEventId(event.id)}
                          >
                            <h5 class="font-semibold">{event.title}</h5>
                            <p class="text-sm text-gray-600">{event.location}</p>
                            <p class="text-sm text-gray-500">
                              {new Date(event.start_date).toLocaleDateString('es-DO')}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Show>
                  
                  <Show when={error()}>
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p class="text-red-700">{error()}</p>
                    </div>
                  </Show>
                  
                  <div class="flex gap-4">
                    <Button 
                      variant="success" 
                      onClick={performCheckin}
                      loading={isCheckingIn()}
                      disabled={!selectedEventId() || isCheckingIn()}
                      class="flex-1"
                    >
                      {isCheckingIn() ? 'Procesando...' : 'Confirmar Check-in'}
                    </Button>
                    <Button variant="outline" onClick={resetSearch}>
                      Nueva búsqueda
                    </Button>
                  </div>
                </div>
              </Card>
            }>
              <Card title="Buscar Visitante">
                <div class="space-y-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Código de registro, email o teléfono
                    </label>
                    <input
                      type="text"
                      value={searchCode()}
                      onInput={(e) => setSearchCode(e.target.value)}
                      placeholder="Ingresa tu código, email o teléfono"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          searchVisitor();
                        }
                      }}
                    />
                  </div>
                  
                  <Show when={error()}>
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p class="text-red-700">{error()}</p>
                    </div>
                  </Show>
                  
                  <Button 
                    variant="primary" 
                    onClick={searchVisitor}
                    loading={isSearching()}
                    disabled={!searchCode().trim() || isSearching()}
                    class="w-full"
                  >
                    {isSearching() ? 'Buscando...' : 'Buscar Visitante'}
                  </Button>
                  
                  <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-800 mb-2">💡 Información</h4>
                    <ul class="text-sm text-gray-600 space-y-1">
                      <li>• Puedes usar tu código de registro</li>
                      <li>• O tu email registrado</li>
                      <li>• O tu número de teléfono</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </Show>
          </Show>

          {/* Back button */}
          <div class="text-center mt-8">
            <Button variant="ghost" onClick={() => window.history.back()}>
              ← Volver al inicio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckinPage;