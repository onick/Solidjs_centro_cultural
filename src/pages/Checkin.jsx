import { createSignal } from 'solid-js';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function Checkin() {
  const [visitorId, setVisitorId] = createSignal('');
  const [eventId, setEventId] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [message, setMessage] = createSignal('');

  const handleCheckin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // Aquí iría la lógica de check-in
      setMessage('✅ Check-in exitoso');
    } catch (error) {
      setMessage('❌ Error en el check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div class="checkin-page max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold text-center mb-8 text-ccb-gray">
          Check-in de Visitantes
        </h1>

        <Card title="Registrar Asistencia">
          <form onSubmit={handleCheckin} class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ID del Visitante
              </label>
              <input
                type="text"
                value={visitorId()}
                onInput={(e) => setVisitorId(e.target.value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccb-orange focus:border-transparent"
                placeholder="Ingrese el ID del visitante"
                required
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ID del Evento
              </label>
              <input
                type="text"
                value={eventId()}
                onInput={(e) => setEventId(e.target.value)}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ccb-orange focus:border-transparent"
                placeholder="Ingrese el ID del evento"
                required
              />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              class="w-full"
              loading={loading()}
            >
              Realizar Check-in
            </Button>

            {message() && (
              <div class={`text-center p-4 rounded-lg ${
                message().includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {message()}
              </div>
            )}
          </form>
        </Card>

        <div class="mt-8 text-center">
          <p class="text-gray-600">
            Esta página será mejorada en futuras actualizaciones con:
          </p>
          <ul class="mt-4 space-y-2 text-sm text-gray-500">
            <li>• Escaneo de códigos QR</li>
            <li>• Búsqueda por nombre o documento</li>
            <li>• Lista de asistentes en tiempo real</li>
            <li>• Estadísticas de asistencia</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default Checkin;