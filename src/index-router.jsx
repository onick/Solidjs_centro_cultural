/* @refresh reload */
import { render } from 'solid-js/web';
import { Router, Routes, Route } from '@solidjs/router';

// Componente Home funcional
function Home() {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-gradient-to-r from-orange-500 to-blue-500 text-white py-6">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-bold">🏛️ Centro Cultural Banreservas</h1>
          <p class="text-xl opacity-90">Plataforma SolidJS - Sistema Operativo</p>
        </div>
      </header>

      <main class="container mx-auto px-4 py-12">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">
            ¡Sistema SolidJS Funcionando Correctamente!
          </h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="text-4xl mb-4">🎭</div>
              <h3 class="text-xl font-semibold mb-2 text-blue-600">Eventos</h3>
              <p class="text-gray-600 mb-4">Sistema de gestión de eventos culturales</p>
              <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✅ Listo para desarrollo
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="text-4xl mb-4">📝</div>
              <h3 class="text-xl font-semibold mb-2 text-orange-600">Registro</h3>
              <p class="text-gray-600 mb-4">Sistema de registro de visitantes</p>
              <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✅ Listo para desarrollo
              </div>
            </div>
            
            <div class="bg-white rounded-lg p-6 shadow-lg">
              <div class="text-4xl mb-4">⚙️</div>
              <h3 class="text-xl font-semibold mb-2 text-gray-600">Admin</h3>
              <p class="text-gray-600 mb-4">Panel administrativo</p>
              <div class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✅ Listo para desarrollo
              </div>
            </div>
          </div>
          
          <div class="mt-12 bg-white rounded-lg p-6 shadow-lg">
            <h3 class="text-2xl font-semibold mb-4 text-gray-800">Estado del Sistema</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span class="font-medium">Frontend SolidJS</span>
                <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  ✅ OPERATIVO
                </span>
              </div>
              <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span class="font-medium">Backend API</span>
                <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                  ⚡ Puerto 3080
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Componente 404
function NotFound() {
  return (
    <div class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p class="text-xl text-gray-600">Página no encontrada</p>
      </div>
    </div>
  );
}

// App con Router
function App() {
  return (
    <Routes>
      <Route path="/" component={Home} />
      <Route path="*" component={NotFound} />
    </Routes>
  );
}

// Renderizar la aplicación
const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento root');
}

try {
  render(() => (
    <Router>
      <App />
    </Router>
  ), root);
  console.log('✅ CCB SolidJS Platform iniciada correctamente');
} catch (error) {
  console.error('❌ Error:', error);
}