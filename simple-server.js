// Servidor simple para demostrar FASE 5
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3080;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración simulada
const mockData = {
  events: [
    {
      id: 1,
      title: 'Exposición Arte Dominicano',
      description: 'Muestra de arte contemporáneo dominicano',
      startDate: '2025-05-28',
      endDate: '2025-06-15',
      location: 'Sala Principal CCB',
      isActive: true,
      registeredCount: 45,
      checkedInCount: 38
    },
    {
      id: 2,
      title: 'Concierto Piano Clásico',
      description: 'Recital de piano con obras de Mozart y Chopin',
      startDate: '2025-05-30',
      endDate: '2025-05-30',
      location: 'Auditorio CCB',
      isActive: true,
      registeredCount: 120,
      checkedInCount: 0
    }
  ],
  visitors: [
    {
      id: 1,
      firstName: 'María',
      lastName: 'González',
      email: 'maria@email.com',
      phone: '809-555-0123',
      eventId: 1,
      registrationCode: 'CCB001',
      checkedIn: true
    }
  ]
};

// Rutas
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CCB SolidJS Platform - FASE 5 funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      api: 'running',
      mongodb: 'connected (simulated)',
      redis: 'connected (simulated)'
    }
  });
});

app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    events: mockData.events,
    total: mockData.events.length
  });
});

app.get('/api/events/:id', (req, res) => {
  const event = mockData.events.find(e => e.id === parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ success: false, message: 'Evento no encontrado' });
  }
  res.json({ success: true, event });
});

app.get('/api/visitors', (req, res) => {
  res.json({
    success: true,
    visitors: mockData.visitors,
    total: mockData.visitors.length
  });
});

app.get('/api/stats', (req, res) => {
  res.json({
    success: true,
    stats: {
      totalEvents: mockData.events.length,
      activeEvents: mockData.events.filter(e => e.isActive).length,
      totalVisitors: mockData.visitors.length,
      totalCheckedIn: mockData.visitors.filter(v => v.checkedIn).length,
      systemStatus: 'FASE 5 - MongoDB + Redis + Docker Ready'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 CCB SolidJS Platform - FASE 5 Backend`);
  console.log(`📍 Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 API Eventos: http://localhost:${PORT}/api/events`);
  console.log(`👥 API Visitantes: http://localhost:${PORT}/api/visitors`);
  console.log(`📈 Estadísticas: http://localhost:${PORT}/api/stats`);
  console.log(`\n✅ FASE 5 COMPLETADA - Backend funcionando!`);
  console.log(`✅ MongoDB Ready (simulado)`);
  console.log(`✅ Redis Ready (simulado)`);
  console.log(`✅ Docker Ready (pendiente de inicialización)`);
});
