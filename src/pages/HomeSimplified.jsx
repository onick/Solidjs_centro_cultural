import { createSignal, onMount } from 'solid-js';

function HomeSimplified() {
  const [currentTime, setCurrentTime] = createSignal('');

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

  return (
    <div style={{
      "min-height": "100vh",
      "background": "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #fef3e2 100%)",
      "font-family": "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <header style={{
        "background": "linear-gradient(135deg, #00BDF2 0%, #F99D2A 100%)",
        "color": "white",
        "padding": "2rem",
        "box-shadow": "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <div style={{ "max-width": "1200px", "margin": "0 auto", "display": "flex", "justify-content": "space-between", "align-items": "center" }}>
          <div style={{ "display": "flex", "align-items": "center", "gap": "1rem" }}>
            <div style={{
              "background": "white",
              "color": "#00BDF2",
              "width": "60px",
              "height": "60px",
              "border-radius": "50%",
              "display": "flex",
              "align-items": "center",
              "justify-content": "center",
              "font-weight": "bold",
              "font-size": "20px",
              "box-shadow": "0 4px 15px rgba(0,0,0,0.1)"
            }}>
              CCB
            </div>
            <div>
              <h1 style={{ "margin": "0", "font-size": "1.8rem" }}>Centro Cultural Banreservas</h1>
              <p style={{ "margin": "0", "opacity": "0.9", "font-size": "0.9rem" }}>Sistema de Gestión de Eventos y Visitantes</p>
            </div>
          </div>
          <div style={{ "text-align": "right" }}>
            <div style={{ "font-size": "2rem", "font-weight": "bold" }}>{currentTime()}</div>
            <div style={{ "font-size": "0.8rem", "opacity": "0.9" }}>
              {new Date().toLocaleDateString('es-DO')}
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main style={{ "max-width": "1200px", "margin": "0 auto", "padding": "3rem 2rem" }}>
        {/* Welcome Card */}
        <div style={{
          "background": "white",
          "border-radius": "20px",
          "box-shadow": "0 10px 30px rgba(0,0,0,0.1)",
          "overflow": "hidden",
          "margin-bottom": "3rem"
        }}>
          <div style={{
            "background": "linear-gradient(135deg, #00BDF2 0%, #F99D2A 100%)",
            "color": "white",
            "padding": "3rem",
            "text-align": "center"
          }}>
            <div style={{
              "background": "white",
              "color": "#00BDF2",
              "width": "100px",
              "height": "100px",
              "border-radius": "50%",
              "display": "flex",
              "align-items": "center",
              "justify-content": "center",
              "font-weight": "bold",
              "font-size": "2.5rem",
              "margin": "0 auto 2rem",
              "box-shadow": "0 8px 25px rgba(0,0,0,0.15)"
            }}>
              CCB
            </div>
            <h2 style={{ "margin": "0 0 1rem", "font-size": "2.5rem" }}>
              ¡Bienvenido al Centro Cultural Banreservas!
            </h2>
            <p style={{ "margin": "0", "font-size": "1.2rem", "opacity": "0.9" }}>
              Por favor seleccione una opción:
            </p>
          </div>
          
          <div style={{ "padding": "3rem" }}>
            <div style={{ 
              "display": "grid", 
              "grid-template-columns": "repeat(auto-fit, minmax(250px, 1fr))", 
              "gap": "2rem" 
            }}>
              {/* Ver Eventos */}
              <A href="/eventos" style={{ "text-decoration": "none" }}>
                <div style={{
                  "background": "linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)",
                  "padding": "2rem",
                  "border-radius": "15px",
                  "text-align": "center",
                  "border": "2px solid #e5e7eb",
                  "cursor": "pointer",
                  "transition": "all 0.3s ease"
                }}>
                  <div style={{
                    "background": "linear-gradient(135deg, #00BDF2 0%, #0ea5e9 100%)",
                    "color": "white",
                    "width": "70px",
                    "height": "70px",
                    "border-radius": "15px",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "2rem",
                    "margin": "0 auto 1.5rem",
                    "box-shadow": "0 4px 15px rgba(0,189,242,0.3)"
                  }}>
                    🎭
                  </div>
                  <h3 style={{ "margin": "0 0 1rem", "color": "#474C55", "font-size": "1.3rem" }}>Ver Eventos</h3>
                  <p style={{ "margin": "0", "color": "#6b7280", "font-size": "0.9rem" }}>
                    Explore nuestros eventos actuales y próximos
                  </p>
                </div>
              </A>

              {/* Registrarse */}
              <div onClick={() => alert('📝 Módulo de Registro - Próximamente disponible!\n\nEste módulo incluirá:\n• Formulario de registro intuitivo\n• Selección de eventos\n• Validación en tiempo real\n• Código QR de confirmación')} style={{ "text-decoration": "none" }}>
                <div style={{
                  "background": "linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%)",
                  "padding": "2rem",
                  "border-radius": "15px",
                  "text-align": "center",
                  "border": "2px solid #e5e7eb",
                  "cursor": "pointer",
                  "transition": "all 0.3s ease"
                }}>
                  <div style={{
                    "background": "linear-gradient(135deg, #F99D2A 0%, #fb923c 100%)",
                    "color": "white",
                    "width": "70px",
                    "height": "70px",
                    "border-radius": "15px",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "2rem",
                    "margin": "0 auto 1.5rem",
                    "box-shadow": "0 4px 15px rgba(249,157,42,0.3)"
                  }}>
                    📝
                  </div>
                  <h3 style={{ "margin": "0 0 1rem", "color": "#474C55", "font-size": "1.3rem" }}>Registrarse</h3>
                  <p style={{ "margin": "0", "color": "#6b7280", "font-size": "0.9rem" }}>
                    Regístrese para un evento específico
                  </p>
                </div>
              </div>

              {/* Check-in */}
              <div onClick={() => alert('✅ Módulo de Check-in - Próximamente disponible!\n\nEste módulo incluirá:\n• Verificación por código QR\n• Confirmación de asistencia\n• Estado en tiempo real\n• Estadísticas de evento')} style={{ "text-decoration": "none" }}>
                <div style={{
                  "background": "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  "padding": "2rem",
                  "border-radius": "15px",
                  "text-align": "center",
                  "border": "2px solid #e5e7eb",
                  "cursor": "pointer",
                  "transition": "all 0.3s ease"
                }}>
                  <div style={{
                    "background": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "color": "white",
                    "width": "70px",
                    "height": "70px",
                    "border-radius": "15px",
                    "display": "flex",
                    "align-items": "center",
                    "justify-content": "center",
                    "font-size": "2rem",
                    "margin": "0 auto 1.5rem",
                    "box-shadow": "0 4px 15px rgba(16,185,129,0.3)"
                  }}>
                    ✅
                  </div>
                  <h3 style={{ "margin": "0 0 1rem", "color": "#474C55", "font-size": "1.3rem" }}>Check-in</h3>
                  <p style={{ "margin": "0", "color": "#6b7280", "font-size": "0.9rem" }}>
                    Confirme su asistencia a un evento
                  </p>
                </div>
              </div>
            </div>
            
            {/* Admin Button */}
            <div style={{ "text-align": "center", "margin-top": "2rem" }}>
              <div onClick={() => alert('🔐 Panel Administrativo - Próximamente disponible!\n\nEste módulo incluirá:\n• Dashboard con estadísticas\n• Gestión de eventos (CRUD)\n• Gestión de visitantes\n• Reportes y exportación\n• Configuración del sistema')} style={{ "text-decoration": "none" }}>
                <div style={{
                  "display": "inline-flex",
                  "align-items": "center",
                  "gap": "0.5rem",
                  "background": "linear-gradient(135deg, #F99D2A 0%, #fb923c 100%)",
                  "color": "white",
                  "padding": "1rem 2rem",
                  "border-radius": "15px",
                  "font-weight": "600",
                  "cursor": "pointer",
                  "box-shadow": "0 4px 15px rgba(249,157,42,0.3)",
                  "transition": "all 0.3s ease"
                }}>
                  <span style={{ "font-size": "1.2rem" }}>🔐</span>
                  <span>Acceso Administrativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Cards */}
        <div style={{ 
          "display": "grid", 
          "grid-template-columns": "repeat(auto-fit, minmax(300px, 1fr))", 
          "gap": "2rem" 
        }}>
          <div style={{
            "background": "rgba(255,255,255,0.8)",
            "backdrop-filter": "blur(10px)",
            "padding": "2rem",
            "border-radius": "15px",
            "box-shadow": "0 8px 25px rgba(0,0,0,0.1)",
            "border": "1px solid rgba(255,255,255,0.2)"
          }}>
            <h3 style={{ "color": "#474C55", "margin": "0 0 1.5rem", "display": "flex", "align-items": "center", "gap": "0.5rem" }}>
              <span>📊</span> Estado del Sistema
            </h3>
            <div style={{ "space-y": "1rem" }}>
              <div style={{ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1rem" }}>
                <span style={{ "color": "#6b7280" }}>Frontend SolidJS</span>
                <span style={{ 
                  "background": "#dcfce7", 
                  "color": "#166534", 
                  "padding": "0.25rem 0.75rem", 
                  "border-radius": "9999px", 
                  "font-size": "0.75rem", 
                  "font-weight": "500" 
                }}>
                  ✅ Activo
                </span>
              </div>
              <div style={{ "display": "flex", "justify-content": "space-between", "align-items": "center", "margin-bottom": "1rem" }}>
                <span style={{ "color": "#6b7280" }}>Backend API</span>
                <span style={{ 
                  "background": "#dcfce7", 
                  "color": "#166534", 
                  "padding": "0.25rem 0.75rem", 
                  "border-radius": "9999px", 
                  "font-size": "0.75rem", 
                  "font-weight": "500" 
                }}>
                  ✅ Conectado
                </span>
              </div>
              <div style={{ "display": "flex", "justify-content": "space-between", "align-items": "center" }}>
                <span style={{ "color": "#6b7280" }}>Puerto Servidor</span>
                <span style={{ "color": "#00BDF2", "font-weight": "500" }}>3003</span>
              </div>
            </div>
          </div>

          <div style={{
            "background": "rgba(255,255,255,0.8)",
            "backdrop-filter": "blur(10px)",
            "padding": "2rem",
            "border-radius": "15px",
            "box-shadow": "0 8px 25px rgba(0,0,0,0.1)",
            "border": "1px solid rgba(255,255,255,0.2)"
          }}>
            <h3 style={{ "color": "#474C55", "margin": "0 0 1.5rem", "display": "flex", "align-items": "center", "gap": "0.5rem" }}>
              <span>📍</span> Centro Cultural Banreservas
            </h3>
            <div style={{ "color": "#6b7280", "line-height": "1.6" }}>
              <p style={{ "margin": "0 0 0.5rem", "font-size": "0.9rem" }}>Santo Domingo, República Dominicana</p>
              <p style={{ "margin": "0 0 0.5rem", "font-size": "0.9rem" }}>Horarios: Lunes a Domingo</p>
              <p style={{ "margin": "0 0 1rem", "font-size": "0.9rem" }}>Sistema de Gestión v2.0</p>
              <div style={{ "border-top": "1px solid #e5e7eb", "padding-top": "1rem" }}>
                <p style={{ "margin": "0", "font-size": "0.75rem", "color": "#9ca3af" }}>
                  Desarrollado por Marcelino Francisco M.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        "background": "linear-gradient(135deg, #474C55 0%, #374151 100%)",
        "color": "white",
        "margin-top": "4rem",
        "padding": "2rem"
      }}>
        <div style={{ "max-width": "1200px", "margin": "0 auto", "text-align": "center" }}>
          <div style={{ "display": "flex", "align-items": "center", "justify-content": "center", "gap": "1rem", "margin-bottom": "1rem" }}>
            <div style={{
              "background": "rgba(255,255,255,0.1)",
              "border-radius": "50%",
              "padding": "0.5rem"
            }}>
              <div style={{ "color": "#00BDF2", "font-weight": "bold", "font-size": "1.1rem" }}>CCB</div>
            </div>
            <div>
              <p style={{ "margin": "0", "font-weight": "600" }}>Centro Cultural Banreservas</p>
              <p style={{ "margin": "0", "font-size": "0.9rem", "opacity": "0.75" }}>Sistema de Gestión de Eventos</p>
            </div>
          </div>
          <div style={{ "border-top": "1px solid rgba(255,255,255,0.2)", "padding-top": "1rem" }}>
            <p style={{ "margin": "0", "font-size": "0.9rem", "opacity": "0.75" }}>
              &copy; 2025 Centro Cultural Banreservas - Plataforma SolidJS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomeSimplified;