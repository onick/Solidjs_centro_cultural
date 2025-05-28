/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import App from './App-test';
import './styles/index.css';

console.log('🚀 Iniciando CCB SolidJS Platform...');

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

try {
  render(() => (
    <Router>
      <App />
    </Router>
  ), root);
  console.log('✅ Aplicación renderizada exitosamente');
} catch (error) {
  console.error('❌ Error renderizando aplicación:', error);
}