import fetch from 'node-fetch';

// Simulamos una base de datos en memoria para desarrollo
// En producción esto conectaría con PostgreSQL
let eventsDB = [
  {
    id: 1,
    title: 'Exposición de Arte Dominicano',
    description: 'Una muestra representativa del arte dominicano contemporáneo',
    start_date: '2025-05-28',
    end_date: '2025-06-15',
    start_time: '09:00',
    end_time: '18:00',
    location: 'Sala Principal',
    category: 'exposicion',
    capacity: 200,
    price: 0,
    image_url: null,
    is_active: true,
    requires_registration: true,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    registered_count: 45,
    checked_in_count: 32,
    tags: ['arte', 'cultura', 'dominicano']
  },
  {
    id: 2,
    title: 'Concierto de Piano Clásico',
    description: 'Noche de música clásica con reconocidos pianistas',
    start_date: '2025-06-01',
    end_date: '2025-06-01',
    start_time: '20:00',
    end_time: '22:00',
    location: 'Auditorio Principal',
    category: 'concierto',
    capacity: 150,
    price: 500,
    image_url: null,
    is_active: true,
    requires_registration: true,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    registered_count: 78,
    checked_in_count: 65,
    tags: ['música', 'clásica', 'piano']
  },
  {
    id: 3,
    title: 'Taller de Escritura Creativa',
    description: 'Aprende técnicas de escritura creativa con autores reconocidos',
    start_date: '2025-06-05',
    end_date: '2025-06-12',
    start_time: '15:00',
    end_time: '17:00',
    location: 'Aula 2',
    category: 'taller',
    capacity: 25,
    price: 1000,
    image_url: null,
    is_active: true,
    requires_registration: true,
    created_by: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    registered_count: 18,
    checked_in_count: 12,
    tags: ['escritura', 'literatura', 'taller']
  }
];

let nextEventId = 4;

// Obtener todos los eventos con filtros avanzados
export const getAllEvents = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      search, 
      start_date, 
      end_date,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    let filteredEvents = [...eventsDB];

    // Filtrar por categoría
    if (category && category !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === category);
    }

    // Filtrar por estado
    if (status) {
      const currentDate = new Date();
      const currentDateStr = currentDate.toISOString().split('T')[0];
      
      switch (status) {
        case 'active':
          filteredEvents = filteredEvents.filter(event => 
            event.is_active && event.end_date >= currentDateStr
          );
          break;
        case 'upcoming':
          filteredEvents = filteredEvents.filter(event => 
            event.start_date > currentDateStr
          );
          break;
        case 'past':
          filteredEvents = filteredEvents.filter(event => 
            event.end_date < currentDateStr
          );
          break;
        case 'inactive':
          filteredEvents = filteredEvents.filter(event => !event.is_active);
          break;
      }
    }

    // Filtrar por búsqueda
    if (search) {
      const searchLower = search.toLowerCase();
      filteredEvents = filteredEvents.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filtrar por rango de fechas
    if (start_date) {
      filteredEvents = filteredEvents.filter(event => event.start_date >= start_date);
    }
    if (end_date) {
      filteredEvents = filteredEvents.filter(event => event.end_date <= end_date);
    }

    // Ordenar
    filteredEvents.sort((a, b) => {
      const aValue = a[sort_by];
      const bValue = b[sort_by];
      
      if (sort_order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const paginatedEvents = filteredEvents.slice(offset, offset + parseInt(limit));

    // Estadísticas adicionales
    const stats = {
      total: filteredEvents.length,
      active: filteredEvents.filter(e => e.is_active).length,
      upcoming: filteredEvents.filter(e => e.start_date > new Date().toISOString().split('T')[0]).length,
      past: filteredEvents.filter(e => e.end_date < new Date().toISOString().split('T')[0]).length
    };

    res.json({
      success: true,
      events: paginatedEvents,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: filteredEvents.length,
        total_pages: Math.ceil(filteredEvents.length / parseInt(limit))
      },
      stats,
      filters_applied: {
        category,
        status,
        search,
        start_date,
        end_date
      }
    });

  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos',
      error: error.message
    });
  }
};

// Obtener evento por ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = eventsDB.find(e => e.id === parseInt(id));

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.json({
      success: true,
      event
    });

  } catch (error) {
    console.error('Error obteniendo evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener evento',
      error: error.message
    });
  }
};

// Crear nuevo evento
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      category,
      capacity,
      price = 0,
      image_url,
      requires_registration = true,
      tags = []
    } = req.body;

    // Validaciones básicas
    if (!title || !description || !start_date || !end_date || !location || !category) {
      return res.status(400).json({
        success: false,
        message: 'Campos requeridos: title, description, start_date, end_date, location, category'
      });
    }

    const newEvent = {
      id: nextEventId++,
      title,
      description,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      category,
      capacity: parseInt(capacity) || 100,
      price: parseFloat(price) || 0,
      image_url,
      is_active: true,
      requires_registration,
      created_by: req.user?.id || 1, // Usuario desde el token JWT
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      registered_count: 0,
      checked_in_count: 0,
      tags: Array.isArray(tags) ? tags : []
    };

    eventsDB.push(newEvent);

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      event: newEvent
    });

  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear evento',
      error: error.message
    });
  }
};

// Actualizar evento
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventIndex = eventsDB.findIndex(e => e.id === parseInt(id));

    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const updatedEvent = {
      ...eventsDB[eventIndex],
      ...req.body,
      id: parseInt(id), // Mantener el ID original
      updated_at: new Date().toISOString()
    };

    eventsDB[eventIndex] = updatedEvent;

    res.json({
      success: true,
      message: 'Evento actualizado exitosamente',
      event: updatedEvent
    });

  } catch (error) {
    console.error('Error actualizando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar evento',
      error: error.message
    });
  }
};

// Eliminar evento (soft delete)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventIndex = eventsDB.findIndex(e => e.id === parseInt(id));

    if (eventIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    // Soft delete: marcar como inactivo
    eventsDB[eventIndex].is_active = false;
    eventsDB[eventIndex].updated_at = new Date().toISOString();

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error eliminando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar evento',
      error: error.message
    });
  }
};

// Obtener estadísticas del evento
export const getEventStats = async (req, res) => {
  try {
    const { id } = req.params;
    const event = eventsDB.find(e => e.id === parseInt(id));

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const stats = {
      basic: {
        registered_count: event.registered_count,
        checked_in_count: event.checked_in_count,
        capacity: event.capacity,
        attendance_rate: event.registered_count > 0 ? 
          Math.round((event.checked_in_count / event.registered_count) * 100) : 0,
        occupancy_rate: Math.round((event.registered_count / event.capacity) * 100)
      },
      timeline: {
        days_until_event: Math.ceil((new Date(event.start_date) - new Date()) / (1000 * 60 * 60 * 24)),
        is_past: new Date(event.end_date) < new Date(),
        is_ongoing: new Date() >= new Date(event.start_date) && new Date() <= new Date(event.end_date)
      },
      financial: {
        potential_revenue: event.registered_count * event.price,
        total_revenue: event.checked_in_count * event.price
      }
    };

    res.json({
      success: true,
      event_id: parseInt(id),
      stats
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// Duplicar evento
export const duplicateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const originalEvent = eventsDB.find(e => e.id === parseInt(id));

    if (!originalEvent) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    const duplicatedEvent = {
      ...originalEvent,
      id: nextEventId++,
      title: `${originalEvent.title} (Copia)`,
      registered_count: 0,
      checked_in_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: req.user?.id || 1
    };

    eventsDB.push(duplicatedEvent);

    res.status(201).json({
      success: true,
      message: 'Evento duplicado exitosamente',
      event: duplicatedEvent
    });

  } catch (error) {
    console.error('Error duplicando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al duplicar evento',
      error: error.message
    });
  }
};

export default {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventStats,
  duplicateEvent
};
