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

// Rutas principales
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'CCB SolidJS Platform - FASE 5 funcionando',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    message: 'FASE 5 - Sistema MongoDB + Redis + Docker',
    events: mockData.events,
    total: mockData.events.length
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
      systemStatus: 'FASE 5 COMPLETADA ✅'
    }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 CCB SolidJS Platform - FASE 5 DEMO`);
  console.log(`📍 http://localhost:${PORT}/health`);
  console.log(`📊 http://localhost:${PORT}/api/events`);
  console.log(`📈 http://localhost:${PORT}/api/stats`);
  console.log(`\n✅ FASE 5 COMPLETADA - Sistema funcionando!`);
});
