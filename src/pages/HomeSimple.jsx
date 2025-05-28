import { createSignal, onMount } from 'solid-js';
import { A } from '@solidjs/router';

function HomeSimple() {
  const [message, setMessage] = createSignal('Iniciando...');

  onMount(() => {
    setMessage('¡Centro Cultural Banreservas - SolidJS funcionando!');
    console.log('🏛️ Home component mounted successfully');
  });

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header simple */}
      <header class="bg-gradient-to-r from-orange-500 to-blue-500 text-white py-6">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold">Centro Cultural Banreservas</h1>
          <p class="text-xl opacity-90">Plataforma SolidJS</p>
        </div>
      </header>

      {/* Contenido principal */}
      <main class="container mx-auto px-4 py-12">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">{message()}</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="text-4xl mb-4">🎭</div>
              <h3 class="text-xl font-semibold mb-2">Eventos</h3>
              <p class="text-gray-600 mb-4">Descubre nuestra programación cultural</p>
              <A href="/eventos" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Ver Eventos
              </A>
            </div>            
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="text-4xl mb-4">📝</div>
              <h3 class="text-xl font-semibold mb-2">Registro</h3>
              <p class="text-gray-600 mb-4">Regístrate para participar</p>
              <A href="/registro" class="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Registrarse
              </A>
            </div>
            
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="text-4xl mb-4">✅</div>
              <h3 class="text-xl font-semibold mb-2">Check-in</h3>
              <p class="text-gray-600 mb-4">Confirma tu asistencia</p>
              <A href="/checkin" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Check-in
              </A>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simple */}
      <footer class="bg-gray-800 text-white py-6 mt-12">
        <div class="container mx-auto px-4 text-center">
          <p>&copy; 2025 Centro Cultural Banreservas</p>
          <p class="text-sm opacity-75">Sistema SolidJS - Frontend funcionando ✅</p>
        </div>
      </footer>
    </div>
  );
}

export default HomeSimple;