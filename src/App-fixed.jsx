import { Routes, Route } from '@solidjs/router';
import { onMount, Suspense } from 'solid-js';

// Importar páginas directamente (no lazy loading por ahora)
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Registration from './pages/Registration';
import Checkin from './pages/Checkin';
import NotFound from './pages/NotFound';

// Componente de carga
function LoadingSpinner() {
  return (
    <div class="loading-container">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Cargando...</p>
      </div>
    </div>
  );
}

function App() {
  onMount(() => {
    console.log('🔄 CCB SolidJS Platform iniciada');
    console.log('🎨 Colores corporativos CCB aplicados');
  });

  return (
    <div class="app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Rutas principales */}
          <Route path="/" component={Home} />
          <Route path="/eventos" component={Events} />
          <Route path="/eventos/:id" component={EventDetails} />
          <Route path="/registro" component={Registration} />
          <Route path="/checkin" component={Checkin} />
          
          {/* Ruta 404 */}
          <Route path="*" component={NotFound} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;