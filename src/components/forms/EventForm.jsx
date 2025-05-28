import { createSignal, createEffect, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { eventStore } from '../../stores/eventStore';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const EventForm = (props) => {
  const navigate = useNavigate();
  const [formData, setFormData] = createSignal({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    location: '',
    category: 'exposicion',
    capacity: 100,
    price: 0,
    image_url: '',
    requires_registration: true,
    tags: []
  });

  const [errors, setErrors] = createSignal({});
  const [isLoading, setIsLoading] = createSignal(false);
  const [showPreview, setShowPreview] = createSignal(false);
  const [newTag, setNewTag] = createSignal('');

  const categories = [
    { value: 'exposicion', label: 'Exposición' },
    { value: 'concierto', label: 'Concierto' },
    { value: 'taller', label: 'Taller' },
    { value: 'charla', label: 'Charla' },
    { value: 'teatro', label: 'Teatro' },
    { value: 'cine', label: 'Cine' },
    { value: 'danza', label: 'Danza' },
    { value: 'literatura', label: 'Literatura' },
    { value: 'arte_digital', label: 'Arte Digital' },
    { value: 'otro', label: 'Otro' }
  ];

  // Cargar datos si es edición
  createEffect(() => {
    if (props.eventId && props.mode === 'edit') {
      const event = eventStore.events.find(e => e.id === props.eventId);
      if (event) {
        setFormData({
          title: event.title || '',
          description: event.description || '',
          start_date: event.start_date || '',
          end_date: event.end_date || '',
          start_time: event.start_time || '',
          end_time: event.end_time || '',
          location: event.location || '',
          category: event.category || 'exposicion',
          capacity: event.capacity || 100,
          price: event.price || 0,
          image_url: event.image_url || '',
          requires_registration: event.requires_registration !== false,
          tags: event.tags || []
        });
      }
    }
  });

  const validateForm = () => {
    const newErrors = {};
    const data = formData();

    if (!data.title?.trim()) newErrors.title = 'El título es requerido';
    if (!data.description?.trim()) newErrors.description = 'La descripción es requerida';
    if (!data.start_date) newErrors.start_date = 'La fecha de inicio es requerida';
    if (!data.end_date) newErrors.end_date = 'La fecha de fin es requerida';
    if (!data.start_time) newErrors.start_time = 'La hora de inicio es requerida';
    if (!data.end_time) newErrors.end_time = 'La hora de fin es requerida';
    if (!data.location?.trim()) newErrors.location = 'La ubicación es requerida';
    if (data.capacity < 1) newErrors.capacity = 'La capacidad debe ser mayor a 0';
    if (data.price < 0) newErrors.price = 'El precio no puede ser negativo';

    // Validar fechas
    if (data.start_date && data.end_date) {
      if (new Date(data.start_date) > new Date(data.end_date)) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la de inicio';
      }
    }

    // Validar horas si es el mismo día
    if (data.start_date === data.end_date && data.start_time && data.end_time) {
      if (data.start_time >= data.end_time) {
        newErrors.end_time = 'La hora de fin debe ser posterior a la de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors()[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addTag = () => {
    const tag = newTag().trim().toLowerCase();
    if (tag && !formData().tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      if (props.mode === 'edit') {
        await eventStore.updateEvent(props.eventId, formData());
      } else {
        await eventStore.createEvent(formData());
      }
      
      props.onSuccess?.();
      navigate('/admin/events');
    } catch (error) {
      console.error('Error guardando evento:', error);
      // Mostrar error al usuario
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    props.onCancel?.();
    navigate('/admin/events');
  };

  return (
    <div class="max-w-4xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            {props.mode === 'edit' ? 'Editar Evento' : 'Crear Nuevo Evento'}
          </h1>
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(true)}
            disabled={!formData().title}
          >
            Vista Previa
          </Button>
        </div>

        <form onSubmit={handleSubmit} class="space-y-8">
          {/* Información Básica */}
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Título del Evento *
              </label>
              <input
                type="text"
                value={formData().title}
                onInput={(e) => handleInputChange('title', e.target.value)}
                class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors().title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Exposición de Arte Contemporáneo"
              />
              <Show when={errors().title}>
                <p class="text-red-500 text-sm mt-1">{errors().title}</p>
              </Show>
            </div>

            <div class="lg:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={formData().description}
                onInput={(e) => handleInputChange('description', e.target.value)}
                rows="4"
                class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors().description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe el evento, sus objetivos y lo que pueden esperar los asistentes..."
              />
              <Show when={errors().description}>
                <p class="text-red-500 text-sm mt-1">{errors().description}</p>
              </Show>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Categoría *
              </label>
              <select
                value={formData().category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <For each={categories}>
                  {(category) => (
                    <option value={category.value}>{category.label}</option>
                  )}
                </For>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ubicación *
              </label>
              <input
                type="text"
                value={formData().location}
                onInput={(e) => handleInputChange('location', e.target.value)}
                class={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors().location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Sala Principal, Auditorio"
              />
              <Show when={errors().location}>
                <p class="text-red-500 text-sm mt-1">{errors().location}</p>
              </Show>
            </div>
          </div>

          {/* Botones de Acción */}
          <div class="border-t pt-8 flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading()}
              disabled={isLoading()}
            >
              {props.mode === 'edit' ? 'Actualizar Evento' : 'Crear Evento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
