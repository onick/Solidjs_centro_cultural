import Visitor from '../models/Visitor.js';
import Event from '../models/Event.js';
import { validationResult } from 'express-validator';
import redisManager from '../utils/redisManager.js';
import logger from '../utils/logger.js';

// Obtener todos los visitantes con paginación y filtros
export const getVisitors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const skip = (page - 1) * limit;
    
    // Construir query
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { documentId: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }

    // Intentar obtener de caché
    const cacheKey = `visitors:${JSON.stringify(query)}:${page}:${limit}`;
    const cachedData = await redisManager.get(cacheKey);
    
    if (cachedData) {
      logger.info('Visitantes obtenidos de caché');
      return res.json(cachedData);
    }

    // Obtener de base de datos
    const visitors = await Visitor.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await Visitor.countDocuments(query);
    
    const response = {
      success: true,
      visitors,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    };

    // Guardar en caché por 5 minutos
    await redisManager.set(cacheKey, response, 300);
    
    res.json(response);
  } catch (error) {
    logger.error('Error al obtener visitantes', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener visitantes',
      error: error.message
    });
  }
};

// Obtener un visitante por ID
export const getVisitorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Intentar obtener de caché
    const cacheKey = `visitor:${id}`;
    const cachedVisitor = await redisManager.get(cacheKey);
    
    if (cachedVisitor) {
      logger.info(`Visitante ${id} obtenido de caché`);
      return res.json({
        success: true,
        visitor: cachedVisitor
      });
    }

    const visitor = await Visitor.findById(id)
      .populate('registeredEvents.event', 'title startDate location');
    
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no encontrado'
      });
    }

    // Guardar en caché por 10 minutos
    await redisManager.set(cacheKey, visitor, 600);
    
    res.json({
      success: true,
      visitor
    });
  } catch (error) {
    logger.error('Error al obtener visitante', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener visitante',
      error: error.message
    });
  }
};

// Crear un nuevo visitante
export const createVisitor = async (req, res) => {
  try {
    // Validar datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const visitorData = req.body;

    // Verificar si ya existe un visitante con el mismo documento
    const existingVisitor = await Visitor.findOne({ 
      documentId: visitorData.documentId 
    });
    
    if (existingVisitor) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un visitante con este documento'
      });
    }

    // Crear nuevo visitante
    const visitor = new Visitor(visitorData);
    await visitor.save();

    // Invalidar caché de listado
    await redisManager.invalidatePattern('visitors:*');

    // Emitir evento
    await redisManager.publish('visitor:created', visitor);

    logger.info(`Nuevo visitante creado: ${visitor._id}`);

    res.status(201).json({
      success: true,
      message: 'Visitante creado exitosamente',
      visitor
    });
  } catch (error) {
    logger.error('Error al crear visitante', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear visitante',
      error: error.message
    });
  }
};

// Actualizar un visitante
export const updateVisitor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar datos
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    // Si se está actualizando el documento, verificar que no exista otro visitante con el mismo
    if (updateData.documentId) {
      const existingVisitor = await Visitor.findOne({ 
        documentId: updateData.documentId,
        _id: { $ne: id }
      });
      
      if (existingVisitor) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otro visitante con este documento'
        });
      }
    }

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no encontrado'
      });
    }

    // Invalidar caché
    await redisManager.invalidatePattern(`visitor:${id}`);
    await redisManager.invalidatePattern('visitors:*');

    // Emitir evento
    await redisManager.publish('visitor:updated', visitor);

    logger.info(`Visitante actualizado: ${id}`);

    res.json({
      success: true,
      message: 'Visitante actualizado exitosamente',
      visitor
    });
  } catch (error) {
    logger.error('Error al actualizar visitante', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar visitante',
      error: error.message
    });
  }
};

// Eliminar un visitante
export const deleteVisitor = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { status: 'inactive' },
      { new: true }
    );

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no encontrado'
      });
    }

    // Invalidar caché
    await redisManager.invalidatePattern(`visitor:${id}`);
    await redisManager.invalidatePattern('visitors:*');

    // Emitir evento
    await redisManager.publish('visitor:deleted', { id });

    logger.info(`Visitante eliminado: ${id}`);

    res.json({
      success: true,
      message: 'Visitante eliminado exitosamente'
    });
  } catch (error) {
    logger.error('Error al eliminar visitante', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar visitante',
      error: error.message
    });
  }
};

// Registrar visitante a un evento
export const registerForEvent = async (req, res) => {
  try {
    const { visitorId, eventId } = req.body;

    // Verificar que el visitante existe
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no encontrado'
      });
    }

    // Verificar que el evento existe y está activo
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    if (event.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'El evento no está disponible para registro'
      });
    }

    // Verificar capacidad
    if (event.capacity && event.registeredCount >= event.capacity) {
      return res.status(400).json({
        success: false,
        message: 'El evento está lleno'
      });
    }

    // Verificar si ya está registrado
    const alreadyRegistered = visitor.registeredEvents.some(
      reg => reg.event.toString() === eventId
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'El visitante ya está registrado en este evento'
      });
    }

    // Registrar al visitante
    visitor.registeredEvents.push({
      event: eventId,
      registrationDate: new Date(),
      status: 'registered'
    });

    await visitor.save();

    // Actualizar contador del evento
    event.registeredCount = (event.registeredCount || 0) + 1;
    await event.save();

    // Invalidar caché
    await redisManager.invalidatePattern(`visitor:${visitorId}`);
    await redisManager.invalidatePattern(`event:${eventId}`);

    // Emitir evento
    await redisManager.publish('visitor:registered', { visitorId, eventId });

    logger.info(`Visitante ${visitorId} registrado en evento ${eventId}`);

    res.json({
      success: true,
      message: 'Registro exitoso',
      visitor: await visitor.populate('registeredEvents.event', 'title startDate location')
    });
  } catch (error) {
    logger.error('Error al registrar visitante en evento', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar visitante',
      error: error.message
    });
  }
};

// Obtener historial de un visitante
export const getVisitorHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const visitor = await Visitor.findById(id)
      .populate({
        path: 'registeredEvents.event',
        select: 'title startDate endDate location category status'
      });

    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no encontrado'
      });
    }

    res.json({
      success: true,
      history: visitor.registeredEvents
    });
  } catch (error) {
    logger.error('Error al obtener historial del visitante', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener historial',
      error: error.message
    });
  }
};

// Check-in de visitante
export const checkInVisitor = async (req, res) => {
  try {
    const { visitorId, eventId } = req.body;

    // Buscar visitante
    const visitor = await Visitor.findById(visitorId);
    if (!visitor) {
      return res.status(404).json({
        success: false,
        message: 'Visitante no encontrado'
      });
    }

    // Buscar registro del evento
    const registration = visitor.registeredEvents.find(
      reg => reg.event.toString() === eventId && reg.status === 'registered'
    );

    if (!registration) {
      return res.status(400).json({
        success: false,
        message: 'El visitante no está registrado en este evento'
      });
    }

    // Actualizar estado a checked-in
    registration.status = 'attended';
    registration.checkInDate = new Date();
    
    await visitor.save();

    // Emitir evento
    await redisManager.publish('visitor:checkedIn', { visitorId, eventId });

    logger.info(`Check-in realizado: Visitante ${visitorId} en evento ${eventId}`);

    res.json({
      success: true,
      message: 'Check-in realizado exitosamente',
      visitor
    });
  } catch (error) {
    logger.error('Error en check-in', error);
    res.status(500).json({
      success: false,
      message: 'Error al realizar check-in',
      error: error.message
    });
  }
};

// Obtener estadísticas de visitantes
export const getVisitorStats = async (req, res) => {
  try {
    const stats = await Visitor.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          byGender: [
            { $group: { _id: '$gender', count: { $sum: 1 } } }
          ],
          recentRegistrations: [
            { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
            { $count: 'count' }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        total: stats[0].total[0]?.count || 0,
        byStatus: stats[0].byStatus,
        byGender: stats[0].byGender,
        recentRegistrations: stats[0].recentRegistrations[0]?.count || 0
      }
    });
  } catch (error) {
    logger.error('Error al obtener estadísticas', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// Buscar visitante
export const searchVisitor = async (req, res) => {
  try {
    const { query } = req.params;
    
    const visitors = await Visitor.find({
      $or: [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { documentId: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    res.json({
      success: true,
      visitors
    });
  } catch (error) {
    logger.error('Error al buscar visitantes', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar visitantes',
      error: error.message
    });
  }
};

// Registrar a evento (alias para compatibilidad)
export const registerToEvent = registerForEvent;

// Obtener todos los visitantes (alias para compatibilidad)
export const getAllVisitors = getVisitors;