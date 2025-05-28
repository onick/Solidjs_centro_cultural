/* @refresh reload */
import { render } from 'solid-js/web';
import HomeSimplified from './pages/HomeSimplified';

const root = document.getElementById('root');

if (!root) {
  throw new Error('No se encontró el elemento root');
}

try {
  render(() => <HomeSimplified />, root);
  console.log('🚀 CCB SolidJS Platform iniciada correctamente');
  console.log('🎨 Versión simplificada con diseño corporativo');
} catch (error) {
  console.error('❌ Error al inicializar:', error);
}