import { createSignal } from 'solid-js';
import { A } from '@solidjs/router';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen());
  };

  return (
    <header class="ccb-header">
      <div class="header-container">
        {/* Logo CCB */}
        <div class="logo-section">
          <div class="logo">
            <span class="logo-icon">🏛️</span>
            <div class="logo-text">
              <h1>Centro Cultural</h1>
              <span class="banco">Banreservas</span>
            </div>
          </div>
        </div>

        {/* Navegación Principal */}
        <nav class={`main-nav ${isMenuOpen() ? 'nav-open' : ''}`}>
          <A href="/" class="nav-link" activeClass="nav-active">
            <span class="nav-icon">🏠</span>
            Inicio
          </A>
          <A href="/eventos" class="nav-link" activeClass="nav-active">
            <span class="nav-icon">🎭</span>
            Eventos
          </A>
          <A href="/registro" class="nav-link" activeClass="nav-active">
            <span class="nav-icon">📝</span>
            Registro
          </A>
          <A href="/admin" class="nav-link" activeClass="nav-active">
            <span class="nav-icon">⚙️</span>
            Administración
          </A>
        </nav>

        {/* Estado del Sistema */}
        <div class="system-status">
          <div class="status-indicator">
            <span class="status-dot online"></span>
            <span class="status-text">Sistema Activo</span>
          </div>
        </div>

        {/* Botón de Menú (Móvil) */}
        <button class="menu-toggle" onClick={toggleMenu}>
          <span class="menu-icon">{isMenuOpen() ? '✕' : '☰'}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
