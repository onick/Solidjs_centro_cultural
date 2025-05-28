import { A } from '@solidjs/router';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

function NotFound() {
  return (
    <Layout>
      <div class="not-found-page flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div class="text-9xl mb-4">🔍</div>
        <h1 class="text-4xl font-bold text-ccb-gray mb-4">
          404 - Página no encontrada
        </h1>
        <p class="text-xl text-gray-600 mb-8 max-w-md">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div class="flex gap-4">
          <A href="/">
            <Button variant="primary" size="large">
              Ir al inicio
            </Button>
          </A>
          <A href="/eventos">
            <Button variant="secondary" size="large">
              Ver eventos
            </Button>
          </A>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;