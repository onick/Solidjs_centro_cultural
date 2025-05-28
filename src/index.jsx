/* @refresh reload */
import { render } from 'solid-js/web';
import HomeSimplified from './pages/HomeSimplified';

// Importar estilos
import './styles/global.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento root');
}

try {
  render(() => <HomeSimplified />, root);
  console.log('🚀 CCB SolidJS Platform iniciada correctamente');
  console.log('🎨 Versión estática para Vercel - SPA');
} catch (error) {
  console.error('❌ Error al inicializar:', error);
}