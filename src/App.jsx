import { Routes, Route } from '@solidjs/router';
import { onMount, Suspense } from 'solid-js';
import HomeImproved from './pages/HomeImproved';
import EventosImproved from './pages/EventosImproved';
import RegistroPage from './pages/RegistroPage';
import CheckinPage from './pages/CheckinPage';

// Componente de carga simple
function LoadingSpinner() {
  return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">Cargando CCB...</p>
      </div>
    </div>
  );
}

// Componente 404 simple
function NotFoundSimple() {
  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p class="text-xl text-gray-600 mb-4">Página no encontrada</p>
        <a href="/" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

function App() {
  onMount(() => {
    console.log('🔄 CCB SolidJS Platform iniciada - Versión Expandida');
    console.log('📱 Páginas disponibles: Home, Eventos, Registro, Check-in');
  });

  return (
    <div class="app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" component={HomeImproved} />
          <Route path="/eventos" component={EventosImproved} />
          <Route path="/registro" component={RegistroPage} />
          <Route path="/checkin" component={CheckinPage} />
          <Route path="*" component={NotFoundSimple} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;