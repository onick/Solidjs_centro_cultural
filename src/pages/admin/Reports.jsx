import Layout from '../../components/layout/Layout';
import Card from '../../components/ui/Card';

function AdminReports() {
  return (
    <Layout>
      <div class="admin-reports-page">
        <h1 class="text-3xl font-bold mb-6 text-ccb-gray">
          Reportes del Sistema
        </h1>
        
        <Card title="Centro de Reportes">
          <div class="text-center py-12">
            <div class="text-6xl mb-4">📊</div>
            <p class="text-gray-600 mb-4">
              Esta sección mostrará reportes detallados del sistema.
            </p>
            <p class="text-sm text-gray-500">
              Funcionalidad disponible en la Fase 6
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default AdminReports;