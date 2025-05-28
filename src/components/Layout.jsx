import { createSignal, onMount, children } from 'solid-js';
import { A, useLocation } from '@solidjs/router';

function Layout(props) {
  const [currentTime, setCurrentTime] = createSignal('');
  const location = useLocation();
  const c = children(() => props.children);

  onMount(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('es-DO', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  });

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      {/* Header Principal CCB */}
      <header class="bg-gradient-to-r from-[#00BDF2] to-[#F99D2A] shadow-2xl sticky top-0 z-50">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <A href="/" class="flex items-center space-x-4 hover:opacity-90 transition-opacity">
              <div class="bg-white rounded-full p-3 shadow-lg">
                <div class="text-2xl font-bold text-[#00BDF2]">CCB</div>
              </div>
              <div class="text-white">
                <h1 class="text-2xl font-bold">Centro Cultural Banreservas</h1>
                <p class="text-sm opacity-90">Sistema de Gestión de Eventos y Visitantes</p>
              </div>
            </A>
            
            {/* Navegación */}
            <nav class="hidden md:flex items-center space-x-6">
              <A 
                href="/eventos" 
                class={`text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                  isActive('/eventos') ? 'bg-white/20' : ''
                }`}
              >
                Eventos
              </A>
              <A 
                href="/registro" 
                class={`text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                  isActive('/registro') ? 'bg-white/20' : ''
                }`}
              >
                Registro
              </A>
              <A 
                href="/checkin" 
                class={`text-white/90 hover:text-white transition-colors px-3 py-2 rounded-lg ${
                  isActive('/checkin') ? 'bg-white/20' : ''
                }`}
              >
                Check-in
              </A>
            </nav>

            <div class="text-white text-right hidden lg:block">
              <div class="text-2xl font-bold">{currentTime()}</div>
              <div class="text-xs opacity-90">
                {new Date().toLocaleDateString('es-DO', { 
                  day: 'numeric',
                  month: 'short'
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main>
        {c()}
      </main>

      {/* Footer */}
      <footer class="bg-gradient-to-r from-[#474C55] to-[#374151] text-white mt-16">
        <div class="container mx-auto px-6 py-8">
          <div class="text-center">
            <div class="flex items-center justify-center space-x-4 mb-4">
              <div class="bg-white/10 rounded-full p-2">
                <div class="text-lg font-bold text-[#00BDF2]">CCB</div>
              </div>
              <div>
                <p class="font-semibold">Centro Cultural Banreservas</p>
                <p class="text-sm opacity-75">Sistema de Gestión de Eventos</p>
              </div>
            </div>
            <div class="border-t border-white/20 pt-4">
              <p class="text-sm opacity-75">
                &copy; 2025 Centro Cultural Banreservas - Plataforma SolidJS
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;