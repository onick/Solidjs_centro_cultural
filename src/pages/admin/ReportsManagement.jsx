gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
                  <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span class="text-blue-600 text-lg">{action.icon === 'plus' ? '➕' : action.icon === 'user-plus' ? '👤' : '📊'}</span>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">{action.title}</div>
                      <div class="text-sm text-gray-600">{action.description}</div>
                    </div>
                  </div>
                </button>
              )}
            </For>
          </div>
        </Card>
      </Show>
    </div>
  );
};

// Componente Events Report
const EventsReport = (props) => {
  return (
    <div class="space-y-6">
      <Card>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reporte de Eventos</h3>
        <p class="text-gray-600">
          Análisis detallado de eventos para el período seleccionado.
          Esta funcionalidad estará disponible en la siguiente actualización.
        </p>
      </Card>
    </div>
  );
};

// Componente Visitors Report
const VisitorsReport = (props) => {
  return (
    <div class="space-y-6">
      <Card>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reporte de Visitantes</h3>
        <p class="text-gray-600">
          Análisis demográfico y de comportamiento de visitantes.
          Esta funcionalidad estará disponible en la siguiente actualización.
        </p>
      </Card>
    </div>
  );
};

// Componente Financial Report
const FinancialReport = (props) => {
  return (
    <div class="space-y-6">
      <Card>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reporte Financiero</h3>
        <p class="text-gray-600">
          Análisis de ingresos, costos y rentabilidad de eventos.
          Esta funcionalidad estará disponible en la siguiente actualización.
        </p>
      </Card>
    </div>
  );
};

// Componente Analytics Report
const AnalyticsReport = (props) => {
  return (
    <div class="space-y-6">
      <Card>
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Análisis Avanzado</h3>
        <p class="text-gray-600">
          Análisis predictivo y tendencias avanzadas.
          Esta funcionalidad estará disponible en la siguiente actualización.
        </p>
      </Card>
    </div>
  );
};

export default ReportsManagement;
