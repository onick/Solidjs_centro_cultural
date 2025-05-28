import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Event from './models/Event.js';
import Visitor from './models/Visitor.js';
import logger from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'running',
    service: 'CCB SolidJS Backend',
    timestamp: new Date().toISOString()
  });
});

// Rutas básicas de API
app.get('/api/stats', async (req, res) => {
  try {
    // Simulación de estadísticas
    res.json({
      totalEvents: 12,
      totalVisitors: 345,
      activeEvents: 3,
      categories: ['Exposición', 'Concierto', 'Teatro', 'Conferencia']
    });
  } catch (error) {
    logger.error('Error getting stats:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

// Eventos
app.get('/api/events', async (req, res) => {
  try {
    // Datos de ejemplo
    const events = [
      {
        _id: '1',
        title: 'Exposición de Arte Contemporáneo',
        description: 'Una muestra de las obras más representativas del arte dominicano contemporáneo.',
        category: 'Exposición',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-30'),
        location: 'Sala Principal',
        capacity: 100,
        registeredCount: 45,
        featured: true,
        status: 'published'
      },
      {
        _id: '2',
        title: 'Concierto de Jazz',
        description: 'Una noche mágica con los mejores exponentes del jazz nacional.',
        category: 'Concierto',
        startDate: new Date('2025-06-15'),
        endDate: new Date('2025-06-15'),
        location: 'Auditorio',
        capacity: 200,
        registeredCount: 178,
        featured: true,
        status: 'published'
      },
      {
        _id: '3',
        title: 'Obra de Teatro: Don Quijote',
        description: 'Adaptación moderna de la obra clásica de Cervantes.',
        category: 'Teatro',
        startDate: new Date('2025-06-20'),
        endDate: new Date('2025-06-20'),
        location: 'Teatro Principal',
        capacity: 150,
        registeredCount: 120,
        featured: false,
        status: 'published'
      }
    ];
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    logger.error('Error getting events:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// Evento por ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Simulación de un evento
    const event = {
      _id: id,
      title: 'Exposición de Arte Contemporáneo',
      description: 'Una muestra de las obras más representativas del arte dominicano contemporáneo. Esta exposición reúne a los artistas más destacados del país en una celebración de la creatividad y la expresión artística.',
      category: 'Exposición',
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-06-30'),
      location: 'Sala Principal',
      capacity: 100,
      registeredCount: 45,
      featured: true,
      status: 'published',
      requirements: 'Entrada gratuita. Se recomienda reservar con anticipación.',
      duration: 120
    };
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    logger.error('Error getting event:', error);
    res.status(500).json({ error: 'Error al obtener evento' });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  logger.error('Error del servidor:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor backend CCB corriendo en puerto ${PORT}`);
  logger.info(`📍 Health check: http://localhost:${PORT}/health`);
  logger.info(`📍 API: http://localhost:${PORT}/api`);
});