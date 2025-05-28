                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <For each={visitorStore.visitors} fallback={
                <tr>
                  <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    No se encontraron visitantes
                  </td>
                </tr>
              }>
                {(visitor) => (
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedVisitors().includes(visitor.id)}
                        onChange={(e) => handleVisitorSelect(visitor.id, e.target.checked)}
                        class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span class="text-blue-600 font-semibold text-sm">
                            {visitor.first_name.charAt(0)}{visitor.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div class={`text-sm font-medium ${getVisitorStatusColor(visitor)}`}>
                            {visitor.first_name} {visitor.last_name}
                          </div>
                          <div class="text-sm text-gray-500">
                            Código: {visitor.registration_code}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">{visitor.email}</div>
                      <div class="text-sm text-gray-500">{visitor.phone}</div>
                    </td>
                    
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">
                        {visitor.age_group} • {visitor.occupation || 'No especificado'}
                      </div>
                      <Show when={visitor.interests.length > 0}>
                        <div class="flex flex-wrap gap-1 mt-1">
                          <For each={visitor.interests.slice(0, 3)}>
                            {(interest) => (
                              <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {interest}
                              </span>
                            )}
                          </For>
                          <Show when={visitor.interests.length > 3}>
                            <span class="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                              +{visitor.interests.length - 3}
                            </span>
                          </Show>
                        </div>
                      </Show>
                    </td>
                    
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-900">
                        {visitor.visit_count} visita{visitor.visit_count !== 1 ? 's' : ''}
                      </div>
                      <div class="text-sm text-gray-500">
                        {visitor.events_attended.length} evento{visitor.events_attended.length !== 1 ? 's' : ''}
                      </div>
                      <Show when={visitor.last_visit}>
                        <div class="text-xs text-gray-400">
                          Últ: {new Date(visitor.last_visit).toLocaleDateString()}
                        </div>
                      </Show>
                    </td>
                    
                    <td class="px-6 py-4">
                      <div class="flex flex-col space-y-1">
                        <span class={`px-2 py-1 text-xs rounded-full ${
                          visitor.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {visitor.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        <Show when={visitor.marketing_consent}>
                          <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Marketing
                          </span>
                        </Show>
                        <Show when={visitor.visit_count >= 3}>
                          <span class="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Frecuente
                          </span>
                        </Show>
                      </div>
                    </td>
                    
                    <td class="px-6 py-4">
                      <div class="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(visitor.id)}
                        >
                          Ver
                        </Button>
                        <Show when={permissions.can('manage_visitors')}>
                          <A href={`/admin/visitors/${visitor.id}/edit`}>
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                          </A>
                        </Show>
                      </div>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <Show when={visitorStore.pagination?.total_pages > 1}>
          <div class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Mostrando {((pagination().page - 1) * pagination().limit) + 1} a{' '}
                {Math.min(pagination().page * pagination().limit, visitorStore.pagination?.total || 0)} de{' '}
                {visitorStore.pagination?.total || 0} visitantes
              </div>
              <div class="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={pagination().page <= 1}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                  Anterior
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={pagination().page >= (visitorStore.pagination?.total_pages || 1)}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </Show>
      </Card>

      {/* Modal de Detalles del Visitante */}
      <Show when={showDetailModal() && selectedVisitor()}>
        <Modal
          isOpen={showDetailModal()}
          onClose={() => setShowDetailModal(false)}
          title="Detalles del Visitante"
          size="lg"
        >
          <div class="space-y-6">
            {/* Información Personal */}
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Información Personal</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <span class="text-sm font-medium text-gray-500">Nombre Completo:</span>
                  <div class="text-sm text-gray-900">
                    {selectedVisitor().first_name} {selectedVisitor().last_name}
                  </div>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Código de Registro:</span>
                  <div class="text-sm text-gray-900 font-mono">
                    {selectedVisitor().registration_code}
                  </div>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Email:</span>
                  <div class="text-sm text-gray-900">{selectedVisitor().email}</div>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Teléfono:</span>
                  <div class="text-sm text-gray-900">{selectedVisitor().phone}</div>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Grupo de Edad:</span>
                  <div class="text-sm text-gray-900">{selectedVisitor().age_group}</div>
                </div>
                <div>
                  <span class="text-sm font-medium text-gray-500">Ocupación:</span>
                  <div class="text-sm text-gray-900">
                    {selectedVisitor().occupation || 'No especificado'}
                  </div>
                </div>
              </div>
            </div>

            {/* Intereses */}
            <Show when={selectedVisitor().interests?.length > 0}>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Intereses</h3>
                <div class="flex flex-wrap gap-2">
                  <For each={selectedVisitor().interests}>
                    {(interest) => (
                      <span class="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {interest}
                      </span>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Estadísticas de Actividad */}
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Actividad</h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center">
                  <div class="text-2xl font-bold text-blue-600">
                    {selectedVisitor().visit_count}
                  </div>
                  <div class="text-sm text-gray-600">Visitas Totales</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-green-600">
                    {selectedVisitor().events_attended?.length || 0}
                  </div>
                  <div class="text-sm text-gray-600">Eventos Asistidos</div>
                </div>
                <div class="text-center">
                  <div class="text-2xl font-bold text-purple-600">
                    {selectedVisitor().last_visit ? 
                      Math.floor((new Date() - new Date(selectedVisitor().last_visit)) / (1000 * 60 * 60 * 24))
                      : 'N/A'
                    }
                  </div>
                  <div class="text-sm text-gray-600">Días desde última visita</div>
                </div>
              </div>
            </div>

            {/* Eventos Relacionados */}
            <Show when={selectedVisitor().related_events?.length > 0}>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Eventos Asistidos</h3>
                <div class="space-y-2">
                  <For each={selectedVisitor().related_events}>
                    {(event) => (
                      <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div class="font-medium text-gray-900">{event.title}</div>
                          <div class="text-sm text-gray-600">{event.start_date}</div>
                        </div>
                        <span class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {event.category}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Notas */}
            <Show when={selectedVisitor().notes}>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-3">Notas</h3>
                <div class="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p class="text-sm text-gray-700">{selectedVisitor().notes}</p>
                </div>
              </div>
            </Show>
          </div>
        </Modal>
      </Show>

      {/* Modal de Exportación */}
      <Show when={showExportModal()}>
        <Modal
          isOpen={showExportModal()}
          onClose={() => setShowExportModal(false)}
          title="Exportar Visitantes"
        >
          <div class="space-y-4">
            <p class="text-gray-700">
              ¿En qué formato deseas exportar los datos de visitantes?
            </p>
            
            <div class="grid grid-cols-1 gap-3">
              <Button 
                variant="outline" 
                onClick={exportToCSV}
                class="justify-start"
              >
                <div class="text-left">
                  <div class="font-medium">CSV (Recomendado)</div>
                  <div class="text-sm text-gray-500">
                    Para Excel, Google Sheets y análisis de datos
                  </div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {/* Implementar exportación PDF */}}
                class="justify-start"
              >
                <div class="text-left">
                  <div class="font-medium">PDF</div>
                  <div class="text-sm text-gray-500">
                    Reporte imprimible con estadísticas
                  </div>
                </div>
              </Button>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowExportModal(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Modal>
      </Show>
    </div>
  );
};

export default VisitorsManagement;
