/* @refresh reload */
import { render } from 'solid-js/web';

function MinimalApp() {
  return (
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h1 style="color: #F99D2A;">🏛️ Centro Cultural Banreservas</h1>
      <p style="color: #00BDF2;">Sistema SolidJS funcionando correctamente</p>
      <div style="background: #474C55; color: white; padding: 10px; border-radius: 5px; margin: 10px 0;">
        ✅ Frontend operativo
      </div>
      <button 
        style="background: #F99D2A; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;"
        onClick={() => alert('¡SolidJS funcionando!')}
      >
        Probar Interactividad
      </button>
    </div>
  );
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento root');
}

try {
  render(() => <MinimalApp />, root);
  console.log('✅ Aplicación mínima renderizada');
} catch (error) {
  console.error('❌ Error:', error);
}