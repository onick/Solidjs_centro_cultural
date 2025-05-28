import { createSignal, createEffect, Show, For } from 'solid-js';
import { configStore } from '../../stores/configStore';
import { usePermissions } from '../../utils/permissions/permissionService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';

const SystemConfiguration = () => {
  const permissions = usePermissions();
  
  const [activeSection, setActiveSection] = createSignal('general');
  const [showSaveModal, setShowSaveModal] = createSignal(false);
  const [hasChanges, setHasChanges] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);

  // Cargar configuración al inicializar
  createEffect(async () => {
    await configStore.loadSystemConfig();
  });

  const sections = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'kiosk', label: 'Kioscos', icon: '📱' },
    { id: 'registration', label: 'Registro', icon: '📝' },
    { id: 'notifications', label: 'Notificaciones', icon: '🔔' },
    { id: 'security', label: 'Seguridad', icon: '🔒' },
    { id: 'branding', label: 'Marca', icon: '🎨' }
  ];

  const handleConfigChange = (section, field, value) => {
    configStore.updateConfig(section, field, value);
    setHasChanges(true);
  };

  const saveConfiguration = async () => {
    setIsLoading(true);
    try {
      await configStore.saveConfiguration();
      setHasChanges(false);
      setShowSaveModal(false);
    } catch (error) {
      console.error('Error guardando configuración:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefaults = async () => {
    if (confirm('¿Estás seguro de restablecer toda la configuración?')) {
      await configStore.resetToDefaults();
      setHasChanges(false);
    }
  };

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p class="text-gray-600 mt-1">
            Administra la configuración global del centro cultural
          </p>
        </div>
        <div class="flex space-x-3">
          <Show when={hasChanges()}>
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Descartar Cambios
            </Button>
          </Show>
          <Button 
            variant="outline"
            onClick={resetToDefaults}
          >
            Restablecer
          </Button>
          <Button 
            onClick={() => setShowSaveModal(true)}
            disabled={!hasChanges()}
            loading={isLoading()}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar de Secciones */}
        <div class="lg:col-span-1">
          <Card>
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Configuración</h3>
            <nav class="space-y-2">
              <For each={sections}>
                {(section) => (
                  <button
                    onClick={() => setActiveSection(section.id)}
                    class={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection() === section.id
                        ? 'bg-blue-100 text-blue-900 border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span class="text-lg">{section.icon}</span>
                    <span class="font-medium">{section.label}</span>
                  </button>
                )}
              </For>
            </nav>
          </Card>
        </div>

        {/* Contenido de Configuración */}
        <div class="lg:col-span-3">
          <Show when={activeSection() === 'general'}>
            <GeneralConfig onConfigChange={handleConfigChange} />
          </Show>
          
          <Show when={activeSection() === 'kiosk'}>
            <KioskConfig onConfigChange={handleConfigChange} />
          </Show>
          
          <Show when={activeSection() === 'registration'}>
            <RegistrationConfig onConfigChange={handleConfigChange} />
          </Show>
          
          <Show when={activeSection() === 'notifications'}>
            <NotificationsConfig onConfigChange={handleConfigChange} />
          </Show>
          
          <Show when={activeSection() === 'security'}>
            <SecurityConfig onConfigChange={handleConfigChange} />
          </Show>
          
          <Show when={activeSection() === 'branding'}>
            <BrandingConfig onConfigChange={handleConfigChange} />
          </Show>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <Show when={showSaveModal()}>
        <Modal
          isOpen={showSaveModal()}
          onClose={() => setShowSaveModal(false)}
          title="Guardar Configuración"
        >
          <div class="space-y-4">
            <p class="text-gray-700">
              ¿Estás seguro de que deseas guardar todos los cambios de configuración?
              Algunos cambios pueden requerir reiniciar los kioscos.
            </p>
            <div class="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowSaveModal(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={saveConfiguration}
                loading={isLoading()}
              >
                Guardar
              </Button>
            </div>
          </div>
        </Modal>
      </Show>
    </div>
  );
};

// Componente de Configuración General
const GeneralConfig = ({ onConfigChange }) => {
  const config = configStore.config;
  
  return (
    <Card>
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuración General</h3>
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sitio
            </label>
            <input
              type="text"
              value={config()?.general?.site_name || ''}
              onInput={(e) => onConfigChange('general', 'site_name', e.target.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Zona Horaria
            </label>
            <select
              value={config()?.general?.timezone || ''}
              onChange={(e) => onConfigChange('general', 'timezone', e.target.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Santo_Domingo">República Dominicana (AST)</option>
              <option value="America/New_York">Nueva York (EST)</option>
              <option value="America/Los_Angeles">Los Ángeles (PST)</option>
              <option value="Europe/Madrid">Madrid (CET)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={config()?.general?.language || ''}
              onChange={(e) => onConfigChange('general', 'language', e.target.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="es">Español</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Moneda
            </label>
            <select
              value={config()?.general?.currency || ''}
              onChange={(e) => onConfigChange('general', 'currency', e.target.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DOP">Peso Dominicano (DOP)</option>
              <option value="USD">Dólar Americano (USD)</option>
              <option value="EUR">Euro (EUR)</option>
            </select>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descripción del Sitio
          </label>
          <textarea
            value={config()?.general?.site_description || ''}
            onInput={(e) => onConfigChange('general', 'site_description', e.target.value)}
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descripción breve del centro cultural..."
          />
        </div>
      </div>
    </Card>
  );
};

// Componente de Configuración de Kioscos
const KioskConfig = ({ onConfigChange }) => {
  const config = configStore.config;
  
  return (
    <Card>
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuración de Kioscos</h3>
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de Inactividad (segundos)
            </label>
            <input
              type="number"
              min="60"
              max="1800"
              value={config()?.kiosk?.idle_timeout || 300}
              onInput={(e) => onConfigChange('kiosk', 'idle_timeout', parseInt(e.target.value))}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de Fuente
            </label>
            <select
              value={config()?.kiosk?.font_size || 'large'}
              onChange={(e) => onConfigChange('kiosk', 'font_size', e.target.value)}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="small">Pequeño</option>
              <option value="medium">Mediano</option>
              <option value="large">Grande</option>
              <option value="extra-large">Extra Grande</option>
            </select>
          </div>
        </div>
        
        <div class="space-y-4">
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config()?.kiosk?.auto_refresh || false}
              onChange={(e) => onConfigChange('kiosk', 'auto_refresh', e.target.checked)}
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700">
              Actualización Automática
            </span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config()?.kiosk?.show_keyboard || true}
              onChange={(e) => onConfigChange('kiosk', 'show_keyboard', e.target.checked)}
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700">
              Mostrar Teclado Virtual
            </span>
          </label>
        </div>
      </div>
    </Card>
  );
};

// Componente de Configuración de Registro
const RegistrationConfig = ({ onConfigChange }) => {
  const config = configStore.config;
  
  return (
    <Card>
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuración de Registro</h3>
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Capacidad Máxima por Evento
            </label>
            <input
              type="number"
              min="10"
              max="2000"
              value={config()?.registration?.max_capacity_per_event || 500}
              onInput={(e) => onConfigChange('registration', 'max_capacity_per_event', parseInt(e.target.value))}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Límite de Registro (horas antes)
            </label>
            <input
              type="number"
              min="0"
              max="168"
              value={config()?.registration?.registration_deadline_hours || 2}
              onInput={(e) => onConfigChange('registration', 'registration_deadline_hours', parseInt(e.target.value))}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div class="space-y-4">
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config()?.registration?.require_email || true}
              onChange={(e) => onConfigChange('registration', 'require_email', e.target.checked)}
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700">
              Requerir Email
            </span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config()?.registration?.require_phone || true}
              onChange={(e) => onConfigChange('registration', 'require_phone', e.target.checked)}
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700">
              Requerir Teléfono
            </span>
          </label>
          
          <label class="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={config()?.registration?.allow_marketing || true}
              onChange={(e) => onConfigChange('registration', 'allow_marketing', e.target.checked)}
              class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span class="text-sm font-medium text-gray-700">
              Permitir Consentimiento de Marketing
            </span>
          </label>
        </div>
      </div>
    </Card>
  );
};

// Componentes adicionales (simplificados por espacio)
const NotificationsConfig = ({ onConfigChange }) => (
  <Card>
    <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuración de Notificaciones</h3>
    <p class="text-gray-600">Configuración de notificaciones disponible en próxima actualización.</p>
  </Card>
);

const SecurityConfig = ({ onConfigChange }) => (
  <Card>
    <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuración de Seguridad</h3>
    <p class="text-gray-600">Configuración de seguridad disponible en próxima actualización.</p>
  </Card>
);

const BrandingConfig = ({ onConfigChange }) => (
  <Card>
    <h3 class="text-lg font-semibold text-gray-900 mb-6">Configuración de Marca</h3>
    <p class="text-gray-600">Configuración de marca disponible en próxima actualización.</p>
  </Card>
);

export default SystemConfiguration;
