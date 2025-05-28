// Sistema de reportes y estadísticas avanzado
import Event from '../models/Event.js';
import Visitor from '../models/Visitor.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import redisManager from '../utils/redisManager.js';

// Dashboard principal con estadísticas generales
export const getDashboardStats = async (req, res) => {
  try {
    // Intentar obtener de caché
    const cacheKey = 'dashboard:stats';
    const cachedStats = await redisManager.get(cacheKey);
    
    if (cachedStats) {
      logger.info('Dashboard stats obtenidos de caché');
      return res.json(cachedStats);
    }

    const currentDate = new Date();
    
    // Estadísticas básicas
    const [
      totalEvents,
      activeEvents,
      upcomingEvents,
      totalVisitors,
      totalUsers
    ] = await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ 
        status: 'published',
        endDate: { $gte: currentDate }
      }),
      Event.countDocuments({
        startDate: { $gt: currentDate }
      }),
      Visitor.countDocuments({ status: 'active' }),
      User.countDocuments({ isActive: true })
    ]);

    // Eventos por categoría
    const eventsByCategory = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Visitantes registrados en los últimos 30 días
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentVisitors = await Visitor.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Próximos eventos (próximos 7 días)
    const sevenDaysFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextEvents = await Event.find({
      startDate: { $gte: currentDate, $lte: sevenDaysFromNow },
      status: 'published'
    })
    .select('title startDate location capacity registeredCount')
    .sort({ startDate: 1 })
    .limit(5);

    const stats = {
      success: true,
      dashboard: {
        overview: {
          totalEvents,
          activeEvents,
          upcomingEvents,
          totalVisitors,
          totalUsers,
          recentVisitors
        },
        eventsByCategory: eventsByCategory.map(cat => ({
          category: cat._id,
          count: cat.count
        })),
        nextEvents,
        lastUpdated: new Date()
      }
    };

    // Guardar en caché por 5 minutos
    await redisManager.set(cacheKey, stats, 300);

    res.json(stats);
  } catch (error) {
    logger.error('Error obteniendo estadísticas del dashboard', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// Estadísticas detalladas de eventos
export const getEventStats = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    
    // Construir filtro
    const filter = {};
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }
    if (category) filter.category = category;

    // Estadísticas agregadas
    const stats = await Event.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalEvents: { $sum: 1 },
          totalCapacity: { $sum: '$capacity' },
          totalRegistered: { $sum: '$registeredCount' },
          avgCapacity: { $avg: '$capacity' },
          avgRegistered: { $avg: '$registeredCount' }
        }
      }
    ]);

    // Eventos por mes
    const eventsByMonth = await Event.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            year: { $year: '$startDate' },
            month: { $month: '$startDate' }
          },
          count: { $sum: 1 },
          totalRegistered: { $sum: '$registeredCount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {},
      eventsByMonth
    });
  } catch (error) {
    logger.error('Error obteniendo estadísticas de eventos', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de eventos',
      error: error.message
    });
  }
};

// Estadísticas detalladas de visitantes
export const getVisitorStats = async (req, res) => {
  try {
    const stats = await Visitor.aggregate([
      {
        $facet: {
          demographics: [
            {
              $group: {
                _id: {
                  gender: '$gender',
                  ageRange: {
                    $switch: {
                      branches: [
                        { case: { $lt: ['$age', 18] }, then: 'Menor de 18' },
                        { case: { $lt: ['$age', 25] }, then: '18-24' },
                        { case: { $lt: ['$age', 35] }, then: '25-34' },
                        { case: { $lt: ['$age', 45] }, then: '35-44' },
                        { case: { $lt: ['$age', 55] }, then: '45-54' },
                        { case: { $gte: ['$age', 55] }, then: '55+' }
                      ],
                      default: 'No especificado'
                    }
                  }
                },
                count: { $sum: 1 }
              }
            }
          ],
          registrationTrend: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 12 }
          ],
          topVisitors: [
            {
              $lookup: {
                from: 'events',
                localField: 'registeredEvents.event',
                foreignField: '_id',
                as: 'events'
              }
            },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                email: 1,
                eventCount: { $size: '$registeredEvents' }
              }
            },
            { $sort: { eventCount: -1 } },
            { $limit: 10 }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      ...stats[0]
    });
  } catch (error) {
    logger.error('Error obteniendo estadísticas de visitantes', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas de visitantes',
      error: error.message
    });
  }
};

// Reporte de asistencia
export const getAttendanceReport = async (req, res) => {
  try {
    const { eventId, startDate, endDate } = req.query;
    
    // Construir pipeline de agregación
    const pipeline = [];
    
    // Filtrar por evento si se especifica
    if (eventId) {
      pipeline.push({
        $match: { _id: eventId }
      });
    }
    
    // Filtrar por fechas si se especifican
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      
      pipeline.push({
        $match: { startDate: dateFilter }
      });
    }
    
    // Agregar información de asistencia
    pipeline.push(
      {
        $lookup: {
          from: 'visitors',
          let: { eventId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ['$$eventId', '$registeredEvents.event']
                }
              }
            }
          ],
          as: 'attendees'
        }
      },
      {
        $project: {
          title: 1,
          startDate: 1,
          capacity: 1,
          registeredCount: 1,
          attendedCount: {
            $size: {
              $filter: {
                input: '$attendees',
                cond: {
                  $eq: ['$$this.registeredEvents.status', 'attended']
                }
              }
            }
          },
          attendanceRate: {
            $multiply: [
              {
                $divide: [
                  { $size: '$attendees' },
                  { $max: ['$capacity', 1] }
                ]
              },
              100
            ]
          }
        }
      },
      { $sort: { startDate: -1 } }
    );
    
    const report = await Event.aggregate(pipeline);
    
    res.json({
      success: true,
      report
    });
  } catch (error) {
    logger.error('Error generando reporte de asistencia', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar reporte de asistencia',
      error: error.message
    });
  }
};

// Exportar reportes
export const exportReport = async (req, res) => {
  try {
    const { type, format = 'json' } = req.params;
    
    // Por ahora solo implementamos JSON
    // En el futuro se pueden agregar CSV, PDF, Excel
    
    let data;
    switch (type) {
      case 'events':
        data = await Event.find().lean();
        break;
      case 'visitors':
        data = await Visitor.find().select('-password').lean();
        break;
      case 'attendance':
        data = await getAttendanceData();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Tipo de reporte no válido'
        });
    }
    
    res.json({
      success: true,
      type,
      format,
      data,
      generatedAt: new Date()
    });
  } catch (error) {
    logger.error('Error exportando reporte', error);
    res.status(500).json({
      success: false,
      message: 'Error al exportar reporte',
      error: error.message
    });
  }
};

// Función auxiliar para obtener datos de asistencia
async function getAttendanceData() {
  return Event.aggregate([
    {
      $lookup: {
        from: 'visitors',
        let: { eventId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ['$$eventId', '$registeredEvents.event']
              }
            }
          }
        ],
        as: 'attendees'
      }
    },
    {
      $project: {
        title: 1,
        startDate: 1,
        registeredCount: 1,
        attendedCount: { $size: '$attendees' }
      }
    }
  ]);
}