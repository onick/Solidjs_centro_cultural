import { createSignal, onMount } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { authService } from '../../utils/auth/authService';
import { appActions } from '../../stores/appStore';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

export default function Login() {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [formData, setFormData] = createSignal({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');
  const [showRecoveryModal, setShowRecoveryModal] = createSignal(false);
  const [recoveryEmail, setRecoveryEmail] = createSignal('');
  const [recoveryMessage, setRecoveryMessage] = createSignal('');

  // Verificar si ya está autenticado
  onMount(() => {
    if (authService.isAuthenticated()) {
      navigate('/admin', { replace: true });
    }
  });

  // Manejar cambios en inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpiar error al escribir
    if (error()) {
      setError('');
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { username, password } = formData();
    
    // Validaciones
    if (!username.trim()) {
      setError('Por favor ingresa tu usuario');
      return;
    }
    
    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.login({
        username: username.trim(),
        password: password.trim()
      });

      if (result.success) {
        // Login exitoso
        appActions.showNotification({
          type: 'success',
          message: `¡Bienvenido ${result.user.name || result.user.username}!`
        });
        
        // Redirigir según el rol
        const redirectPath = result.user.role === 'admin' ? '/admin' : '/';
        navigate(redirectPath, { replace: true });
      } else {
        setError(result.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar recuperación de contraseña
  const handlePasswordRecovery = async () => {
    if (!recoveryEmail().trim()) {
      setRecoveryMessage('Por favor ingresa tu email');
      return;
    }

    try {
      // Simular envío de recuperación
      // En producción, esto llamaría al backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRecoveryMessage('Se han enviado las instrucciones a tu email');
      setTimeout(() => {
        setShowRecoveryModal(false);
        setRecoveryEmail('');
        setRecoveryMessage('');
      }, 2000);
    } catch (err) {
      setRecoveryMessage('Error al enviar. Intenta nuevamente.');
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        {/* Header con logo */}
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-ccb-orange to-ccb-blue rounded-2xl mb-4 shadow-lg">
            <span class="text-white text-3xl font-bold">CCB</span>
          </div>
          <h1 class="text-3xl font-bold text-ccb-gray-dark mb-2">
            Panel de Administración
          </h1>
          <p class="text-ccb-gray">
            Centro Cultural Banreservas
          </p>
        </div>

        {/* Formulario de login */}
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-8">
            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Campo Usuario */}
              <div>
                <label 
                  for="username" 
                  class="block text-sm font-medium text-ccb-gray-dark mb-2"
                >
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={formData().username}
                  onInput={(e) => handleInputChange('username', e.target.value)}
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu usuario"
                  disabled={loading()}
                />
              </div>

              {/* Campo Contraseña */}
              <div>
                <label 
                  for="password" 
                  class="block text-sm font-medium text-ccb-gray-dark mb-2"
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData().password}
                  onInput={(e) => handleInputChange('password', e.target.value)}
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200"
                  placeholder="Ingresa tu contraseña"
                  disabled={loading()}
                />
              </div>

              {/* Error */}
              {error() && (
                <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div class="flex items-center">
                    <div class="flex-shrink-0">
                      <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="ml-3">
                      <p class="text-sm text-red-800">{error()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón de envío */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                class="w-full"
                loading={loading()}
                disabled={loading()}
              >
                {loading() ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            {/* Enlaces adicionales */}
            <div class="mt-6 text-center">
              <button
                type="button"
                onClick={() => setShowRecoveryModal(true)}
                class="text-ccb-blue hover:text-ccb-blue-dark text-sm font-medium transition-colors duration-200"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          {/* Footer */}
          <div class="bg-gray-50 px-8 py-4 text-center">
            <p class="text-xs text-gray-500">
              © 2025 Centro Cultural Banreservas. Todos los derechos reservados.
            </p>
          </div>
        </div>

        {/* Credenciales de prueba */}
        <div class="mt-6 bg-blue-50 rounded-xl p-4 text-center">
          <p class="text-sm text-blue-800 font-medium mb-2">Credenciales de prueba:</p>
          <p class="text-xs text-blue-600">
            Usuario: <span class="font-mono bg-white px-2 py-1 rounded">admin</span> |
            Contraseña: <span class="font-mono bg-white px-2 py-1 rounded">Admin123!</span>
          </p>
        </div>
      </div>

      {/* Modal de recuperación de contraseña */}
      <Modal
        isOpen={showRecoveryModal()}
        onClose={() => {
          setShowRecoveryModal(false);
          setRecoveryEmail('');
          setRecoveryMessage('');
        }}
        title="Recuperar Contraseña"
      >
        <div class="space-y-4">
          <p class="text-gray-600">
            Ingresa tu email para recibir instrucciones de recuperación:
          </p>
          
          <input
            type="email"
            value={recoveryEmail()}
            onInput={(e) => setRecoveryEmail(e.target.value)}
            placeholder="tu-email@ejemplo.com"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent"
          />

          {recoveryMessage() && (
            <div class={`p-3 rounded-xl ${
              recoveryMessage().includes('Error') 
                ? 'bg-red-50 text-red-800' 
                : 'bg-green-50 text-green-800'
            }`}>
              <p class="text-sm">{recoveryMessage()}</p>
            </div>
          )}

          <div class="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowRecoveryModal(false);
                setRecoveryEmail('');
                setRecoveryMessage('');
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handlePasswordRecovery}
            >
              Enviar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
