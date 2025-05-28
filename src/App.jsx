import { Routes, Route } from '@solidjs/router';
import { onMount, Suspense } from 'solid-js';
import HomeSimplified from './pages/HomeSimplified';
import EventosImproved from './pages/EventosImproved';
import RegistroPage from './pages/RegistroPage';
import CheckinPage from './pages/CheckinPage';

// Componente de carga simple
function LoadingSpinner() {
  return (
    <div style={{
      "display": "flex",
      "align-items": "center", 
      "justify-content": "center",
      "min-height": "100vh",
      "background": "linear-gradient(135deg, #00BDF2 0%, #F99D2A 100%)"
    }}>
      <div style={{ "text-align": "center", "color": "white" }}>
        <div style={{
          "width": "60px",
          "height": "60px", 
          "border": "4px solid white",
          "border-top": "4px solid transparent",
          "border-radius": "50%",
          "animation": "spin 1s linear infinite",
          "margin": "0 auto 1rem"
        }}></div>
        <p style={{ "font-size": "1.2rem" }}>Cargando CCB...</p>
      </div>
    </div>
  );
}

// Componente 404 mejorado
function NotFound() {
  return (
    <div style={{
      "min-height": "100vh",
      "background": "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #fef3e2 100%)",
      "display": "flex",
      "align-items": "center",
      "justify-content": "center",
      "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        "text-align": "center",
        "background": "white",
        "padding": "3rem",
        "border-radius": "20px",
        "box-shadow": "0 20px 40px rgba(0,0,0,0.1)"
      }}>
        <div style={{
          "background": "#00BDF2",
          "color": "white",
          "width": "80px",
          "height": "80px",
          "border-radius": "50%",
          "display": "flex",
          "align-items": "center",
          "justify-content": "center",
          "font-weight": "bold",
          "font-size": "2rem",
          "margin": "0 auto 2rem"
        }}>
          CCB
        </div>
        <h1 style={{ "font-size": "4rem", "color": "#374151", "margin": "0 0 1rem" }}>404</h1>
        <p style={{ "font-size": "1.2rem", "color": "#6b7280", "margin": "0 0 2rem" }}>Página no encontrada</p>
        <a 
          href="/" 
          style={{
            "display": "inline-block",
            "background": "linear-gradient(135deg, #00BDF2 0%, #F99D2A 100%)",
            "color": "white",
            "padding": "1rem 2rem",
            "border-radius": "10px",
            "text-decoration": "none",
            "font-weight": "600",
            "transition": "transform 0.2s"
          }}
        >
          Volver al inicio
        </a>
      </div>
    </div>
  );
}

function App() {
  onMount(() => {
    console.log('🔄 CCB SolidJS Platform iniciada - Versión Vercel');
    console.log('📱 Páginas disponibles: Home, Eventos, Registro, Check-in');
    
    // Añadir estilos de animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  });

  return (
    <div class="app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" component={HomeSimplified} />
          <Route path="/eventos" component={EventosImproved} />
          <Route path="/registro" component={RegistroPage} />
          <Route path="/checkin" component={CheckinPage} />
          <Route path="*" component={NotFound} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;