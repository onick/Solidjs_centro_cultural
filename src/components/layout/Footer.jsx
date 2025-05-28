function Footer() {
  return (
    <footer class="ccb-footer">
      <div class="footer-container">
        {/* Información del Centro */}
        <div class="footer-section">
          <h3>Centro Cultural Banreservas</h3>
          <p>Promoviendo la cultura dominicana</p>
          <div class="contact-info">
            <p>📍 Santo Domingo, República Dominicana</p>
            <p>📞 (809) 960-2121</p>
            <p>✉️ cultura@banreservas.com</p>
          </div>
        </div>

        {/* Enlaces Útiles */}
        <div class="footer-section">
          <h4>Enlaces</h4>
          <ul class="footer-links">
            <li><a href="/eventos">Eventos</a></li>
            <li><a href="/exposiciones">Exposiciones</a></li>
            <li><a href="/talleres">Talleres</a></li>
            <li><a href="/contacto">Contacto</a></li>
          </ul>
        </div>

        {/* Información del Sistema */}
        <div class="footer-section">
          <h4>Sistema</h4>
          <p class="system-info">
            Plataforma SolidJS CCB v1.0<br/>
            Desarrollado en paralelo con Vue.js<br/>
            <span class="sync-status">🔄 Sincronizado</span>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div class="footer-bottom">
        <p>&copy; 2025 Centro Cultural Banreservas. Todos los derechos reservados.</p>
        <p class="dev-info">Desarrollado con SolidJS - Sistema en Paralelo</p>
      </div>
    </footer>
  );
}

export default Footer;
