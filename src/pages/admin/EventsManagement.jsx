-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <input
              type="text"
              value={filters().search}
              onInput={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Buscar eventos..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filters().category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <For each={categories}>
                {(category) => (
                  <option value={category.value}>{category.label}</option>
                )}
              </For>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters().status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <For each={statusOptions}>
                {(status) => (
                  <option value={status.value}>{status.label}</option>
                )}
              </For>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha Desde
            </label>
            <input
              type="date"
              value={filters().start_date}
              onInput={(e) => handleFilterChange('start_date', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Fecha Hasta
            </label>
            <input
              type="date"
              value={filters().end_date}
              onInput={(e) => handleFilterChange('end_date', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Ordenar por
            </label>
            <select
              value={filters().sort_by}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <For each={sortOptions}>
                {(sort) => (
                  <option value={sort.value}>{sort.label}</option>
                )}
              </For>
            </select>
          </div>
        </div>
      </Card>

      {/* Acciones en lote */}
      <Show when={selectedEvents().length > 0}>
        <Card>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <span class="text-sm font-medium text-gray-700">
                {selectedEvents().length} evento(s) seleccionado(s)
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedEvents([])}
              >
                Deseleccionar
              </Button>
            </div>
            <Show when={permissions.can('manage_events')}>
              <div class="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {/* Implementar exportación en lote */}}
                >
                  Exportar
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => {/* Implementar eliminación en lote */}}
                >
                  Eliminar
                </Button>
              </div>
            </Show>
          </div>
        </Card>
      </Show>

      {/* Lista de Eventos */}
      <Card>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEvents().length === eventStore.events.length && eventStore.events.length > 0}
                    onChange={handleSelectAll}
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('title')}
                >
                  Evento
                  <Show when={filters().sort_by === 'title'}>
                    <span class="ml-1">
                      {filters().sort_order === 'asc' ? '↑' : '↓'}
                    </span>
                  </Show>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('start_date')}
                >
                  Fechas
                  <Show when={filters().sort_by === 'start_date'}>
                    <span class="ml-1">
                      {filters().sort_order === 'asc' ? '↑' : '↓'}
                    </span>
                  </Show>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th 
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('registered_count')}
                >
                  Ocupación
                  <Show when={filters().sort_by === 'registered_count'}>
                    <span class="ml-1">
                      {filters().sort_order === 'asc' ? '↑' : '↓'}
                    </span>
                  </Show>
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <For each={eventStore.events} fallback={
                <tr>
                  <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                    No se encontraron eventos
                  </td>
                </tr>
              }>
                {(event) => {
                  const status = getEventStatusBadge(event);
                  const occupancy = Math.round((event.registered_count / event.capacity) * 100);
                  
                  return (
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedEvents().includes(event.id)}
                          onChange={(e) => handleEventSelect(event.id, e.target.checked)}
                          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <Show when={event.image_url}>
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              class="w-12 h-12 rounded-lg object-cover mr-3"
                            />
                          </Show>
                          <div>
                            <div class="text-sm font-medium text-gray-900">
                              {event.title}
                            </div>
                            <div class="text-sm text-gray-500">
                              {event.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td class="px-6 py-4">
                        <span class="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                          {categories.find(c => c.value === event.category)?.label || event.category}
                        </span>
                      </td>
                      
                      <td class="px-6 py-4 text-sm text-gray-900">
                        <div>{event.start_date}</div>
                        <div class="text-gray-500">{event.start_time}</div>
                      </td>
                      
                      <td class="px-6 py-4">
                        <span class={`px-2 py-1 text-xs rounded-full ${status.color}`}>
                          {status.text}
                        </span>
                      </td>
                      
                      <td class="px-6 py-4">
                        <div class="flex items-center">
                          <div class="flex-1">
                            <div class={`text-sm font-medium ${getOccupancyColor(occupancy)}`}>
                              {event.registered_count} / {event.capacity}
                            </div>
                            <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div 
                                class={`h-2 rounded-full ${
                                  occupancy >= 90 ? 'bg-red-500' : 
                                  occupancy >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(occupancy, 100)}%` }}
                              />
                            </div>
                          </div>
                          <div class="ml-2 text-xs text-gray-500">
                            {occupancy}%
                          </div>
                        </div>
                      </td>
                      
                      <td class="px-6 py-4">
                        <div class="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleViewStats(event.id)}
                          >
                            Stats
                          </Button>
                          <Show when={permissions.can('manage_events')}>
                            <A href={`/admin/events/${event.id}/edit`}>
                              <Button size="sm" variant="outline">
                                Editar
                              </Button>
                            </A>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDuplicateEvent(event.id)}
                            >
                              Duplicar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="danger"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              Eliminar
                            </Button>
                          </Show>
                        </div>
                      </td>
                    </tr>
                  );
                }}
              </For>
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <Show when={eventStore.pagination?.total_pages > 1}>
          <div class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                Mostrando {((pagination().page - 1) * pagination().limit) + 1} a{' '}
                {Math.min(pagination().page * pagination().limit, eventStore.pagination?.total || 0)} de{' '}
                {eventStore.pagination?.total || 0} eventos
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
                  disabled={pagination().page >= (eventStore.pagination?.total_pages || 1)}
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </div>
        </Show>
      </Card>

      {/* Modal de Confirmación de Eliminación */}
      <Show when={showDeleteModal()}>
        <Modal
          isOpen={showDeleteModal()}
          onClose={() => setShowDeleteModal(false)}
          title="Confirmar Eliminación"
        >
          <div class="space-y-4">
            <p class="text-gray-700">
              ¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.
            </p>
            <div class="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                onClick={confirmDelete}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      </Show>

      {/* Modal de Estadísticas */}
      <Show when={showStatsModal() && selectedEventStats()}>
        <Modal
          isOpen={showStatsModal()}
          onClose={() => setShowStatsModal(false)}
          title="Estadísticas del Evento"
          size="lg"
        >
          <div class="space-y-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-blue-600">
                  {selectedEventStats().basic.registered_count}
                </div>
                <div class="text-sm text-gray-600">Registrados</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600">
                  {selectedEventStats().basic.checked_in_count}
                </div>
                <div class="text-sm text-gray-600">Check-ins</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-purple-600">
                  {selectedEventStats().basic.attendance_rate}%
                </div>
                <div class="text-sm text-gray-600">Asistencia</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-orange-600">
                  {selectedEventStats().basic.occupancy_rate}%
                </div>
                <div class="text-sm text-gray-600">Ocupación</div>
              </div>
            </div>
            
            <Show when={selectedEventStats().financial?.total_revenue > 0}>
              <div class="border-t pt-4">
                <h4 class="font-semibold text-gray-900 mb-2">Información Financiera</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-lg font-bold text-green-600">
                      ${selectedEventStats().financial.total_revenue}
                    </div>
                    <div class="text-sm text-gray-600">Ingresos Reales</div>
                  </div>
                  <div>
                    <div class="text-lg font-bold text-gray-600">
                      ${selectedEventStats().financial.potential_revenue}
                    </div>
                    <div class="text-sm text-gray-600">Ingresos Potenciales</div>
                  </div>
                </div>
              </div>
            </Show>
          </div>
        </Modal>
      </Show>
    </div>
  );
};

export default EventsManagement;
