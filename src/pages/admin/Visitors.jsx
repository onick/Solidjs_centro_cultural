import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';

function AdminVisitors() {
  return (
    <Layout>
      <div class="admin-visitors-page">
        <h1 class="text-3xl font-bold mb-6 text-ccb-gray">
          Visitantes
        </h1>
        
        <Card title="Gestión de Visitantes">
          <div class="text-center py-12">
            <div class="text-6xl mb-4">👥</div>
            <p class="text-gray-600 mb-4">
              Esta sección permitirá gestionar visitantes.
            </p>
            <p class="text-sm text-gray-500">
              Use la opción de Gestión Avanzada en el menú
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default AdminVisitors;