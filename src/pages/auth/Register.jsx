import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { authService } from '../../utils/auth/authService';
import { appActions } from '../../stores/appStore';
import Button from '../../components/ui/Button';

export default function Register() {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [formData, setFormData] = createSignal({
    username: '',
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    role: 'staff'
  });
  
  const [loading, setLoading] = createSignal(false);
  const [errors, setErrors] = createSignal({});

  // Manejar cambios en inputs
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error específico al escribir
    if (errors()[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    const data = formData();

    if (!data.username.trim()) {
      newErrors.username = 'El usuario es requerido';
    } else if (data.username.length < 3) {
      newErrors.username = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!data.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!data.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!data.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (data.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (data.password !== data.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData();
      
      // Llamar al servicio de registro
      const result = await authService.register(registerData);

      if (result.success) {
        appActions.showNotification({
          type: 'success',
          message: 'Usuario registrado exitosamente'
        });
        navigate('/login');
      } else {
        setErrors({ general: result.error || 'Error al registrar usuario' });
      }
    } catch (err) {
      console.error('Error en registro:', err);
      setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
      <div class="w-full max-w-lg">
        {/* Header */}
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-ccb-orange to-ccb-blue rounded-2xl mb-4 shadow-lg">
            <span class="text-white text-3xl font-bold">CCB</span>
          </div>
          <h1 class="text-3xl font-bold text-ccb-gray-dark mb-2">
            Registro de Usuario
          </h1>
          <p class="text-ccb-gray">
            Centro Cultural Banreservas
          </p>
        </div>

        {/* Formulario */}
        <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-8">
            <form onSubmit={handleSubmit} class="space-y-6">
              {/* Error general */}
              {errors().general && (
                <div class="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p class="text-sm text-red-800">{errors().general}</p>
                </div>
              )}

              {/* Campos del formulario */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Usuario */}
                <div>
                  <label class="block text-sm font-medium text-ccb-gray-dark mb-2">
                    Usuario *
                  </label>
                  <input
                    type="text"
                    value={formData().username}
                    onInput={(e) => handleInputChange('username', e.target.value)}
                    class={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200 ${
                      errors().username ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Usuario único"
                    disabled={loading()}
                  />
                  {errors().username && (
                    <p class="mt-1 text-xs text-red-600">{errors().username}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label class="block text-sm font-medium text-ccb-gray-dark mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData().email}
                    onInput={(e) => handleInputChange('email', e.target.value)}
                    class={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200 ${
                      errors().email ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="correo@ejemplo.com"
                    disabled={loading()}
                  />
                  {errors().email && (
                    <p class="mt-1 text-xs text-red-600">{errors().email}</p>
                  )}
                </div>
              </div>

              {/* Nombre completo */}
              <div>
                <label class="block text-sm font-medium text-ccb-gray-dark mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  value={formData().name}
                  onInput={(e) => handleInputChange('name', e.target.value)}
                  class={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200 ${
                    errors().name ? 'border-red-300' : 'border-gray-200'
                  }`}
                  placeholder="Tu nombre completo"
                  disabled={loading()}
                />
                {errors().name && (
                  <p class="mt-1 text-xs text-red-600">{errors().name}</p>
                )}
              </div>

              {/* Rol */}
              <div>
                <label class="block text-sm font-medium text-ccb-gray-dark mb-2">
                  Rol
                </label>
                <select
                  value={formData().role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200"
                  disabled={loading()}
                >
                  <option value="staff">Personal</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              {/* Contraseñas */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-ccb-gray-dark mb-2">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    value={formData().password}
                    onInput={(e) => handleInputChange('password', e.target.value)}
                    class={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200 ${
                      errors().password ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Mínimo 6 caracteres"
                    disabled={loading()}
                  />
                  {errors().password && (
                    <p class="mt-1 text-xs text-red-600">{errors().password}</p>
                  )}
                </div>

                <div>
                  <label class="block text-sm font-medium text-ccb-gray-dark mb-2">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    value={formData().confirmPassword}
                    onInput={(e) => handleInputChange('confirmPassword', e.target.value)}
                    class={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ccb-blue focus:border-transparent transition-all duration-200 ${
                      errors().confirmPassword ? 'border-red-300' : 'border-gray-200'
                    }`}
                    placeholder="Repetir contraseña"
                    disabled={loading()}
                  />
                  {errors().confirmPassword && (
                    <p class="mt-1 text-xs text-red-600">{errors().confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Botones */}
              <div class="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  class="flex-1"
                  onClick={() => navigate('/login')}
                  disabled={loading()}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  class="flex-1"
                  loading={loading()}
                  disabled={loading()}
                >
                  {loading() ? 'Registrando...' : 'Registrar Usuario'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
