import { createSignal, onMount } from 'solid-js';
import { A } from '@solidjs/router';

function HomeImproved() {
  const [currentTime, setCurrentTime] = createSignal('');

  onMount(() => {
    // Actualizar la hora cada segundo
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
    
    console.log('🏛️ Centro Cultural Banreservas - Panel Mejorado');
    
    // Cleanup
    return () => clearInterval(interval);
  });

  return (
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50">
      {/* Header Principal CCB */}
      <header class="bg-gradient-to-r from-[#00BDF2] to-[#F99D2A] shadow-2xl">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="bg-white rounded-full p-3 shadow-lg">
                <div class="text-2xl font-bold text-[#00BDF2]">CCB</div>
              </div>
              <div class="text-white">
                <h1 class="text-2xl font-bold">Centro Cultural Banreservas</h1>
                <p class="text-sm opacity-90">Sistema de Gestión de Eventos y Visitantes</p>
              </div>
            </div>
            <div class="text-white text-right hidden md:block">
              <div class="text-3xl font-bold">{currentTime()}</div>
              <div class="text-sm opacity-90">
                {new Date().toLocaleDateString('es-DO', { 
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Panel Principal */}
      <main class="container mx-auto px-6 py-12">        {/* Tarjeta Central de Bienvenida */}
        <div class="max-w-4xl mx-auto mb-12">
          <div class="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
            <div class="bg-gradient-to-r from-[#00BDF2] to-[#F99D2A] p-8 text-center">
              <div class="bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-xl">
                <div class="text-4xl font-bold text-[#00BDF2]">CCB</div>
              </div>
              <h2 class="text-3xl font-bold text-white mb-4">
                ¡Bienvenido al Centro Cultural Banreservas!
              </h2>
              <p class="text-white/90 text-lg">
                Por favor seleccione una opción:
              </p>
            </div>
            
            {/* Opciones Principales */}
            <div class="p-8">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ver Eventos */}
                <A href="/eventos" class="group">
                  <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center border-2 border-gray-100 hover:border-[#00BDF2] hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div class="bg-gradient-to-br from-[#00BDF2] to-[#0EA5E9] rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      🎭
                    </div>
                    <h3 class="text-xl font-bold text-[#474C55] mb-3">Ver Eventos</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">
                      Explore nuestros eventos actuales y próximos
                    </p>
                  </div>
                </A>

                {/* Registrarse */}
                <A href="/registro" class="group">
                  <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center border-2 border-gray-100 hover:border-[#F99D2A] hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div class="bg-gradient-to-br from-[#F99D2A] to-[#FB923C] rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      📝
                    </div>
                    <h3 class="text-xl font-bold text-[#474C55] mb-3">Registrarse</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">
                      Regístrese para un evento específico
                    </p>
                  </div>
                </A>

                {/* Check-in */}
                <A href="/checkin" class="group">
                  <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 text-center border-2 border-gray-100 hover:border-[#10B981] hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div class="bg-gradient-to-br from-[#10B981] to-[#059669] rounded-2xl w-16 h-16 mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      ✅
                    </div>
                    <h3 class="text-xl font-bold text-[#474C55] mb-3">Check-in</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">
                      Confirme su asistencia a un evento
                    </p>
                  </div>
                </A>
              </div>
              {/* Botón Acceso Administrativo */}
              <div class="mt-8 text-center">
                <A href="/admin" class="group">
                  <div class="inline-flex items-center space-x-3 bg-gradient-to-r from-[#F99D2A] to-[#FB923C] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <span>🔐</span>
                    <span>Acceso Administrativo</span>
                  </div>
                </A>
              </div>
            </div>
          </div>
        </div>

        {/* Información Adicional */}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Estadísticas Rápidas */}
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 class="text-lg font-bold text-[#474C55] mb-4 flex items-center">
              <span class="mr-2">📊</span>
              Estado del Sistema
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Frontend SolidJS</span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Activo
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Backend API</span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Conectado
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Tiempo de Actividad</span>
                <span class="text-[#00BDF2] font-medium">En Línea</span>
              </div>
            </div>
          </div>

          {/* Información de Contacto */}
          <div class="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
            <h3 class="text-lg font-bold text-[#474C55] mb-4 flex items-center">
              <span class="mr-2">📍</span>
              Centro Cultural Banreservas
            </h3>
            <div class="space-y-2 text-gray-600">
              <p class="text-sm">Santo Domingo, República Dominicana</p>
              <p class="text-sm">Horarios: Lunes a Domingo</p>
              <p class="text-sm">Sistema de Gestión v2.0</p>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                  Desarrollado por Marcelino Francisco M.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer Mejorado */}
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

export default HomeImproved;