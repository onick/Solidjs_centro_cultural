import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3080;

// Middleware
app.use(cors());
app.use(express.json());

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
  res.json({
    totalEvents: 12,
    totalVisitors: 345,
    activeEvents: 3,
    categories: ['Exposición', 'Concierto', 'Teatro', 'Conferencia']
  });
});

// Eventos
app.get('/api/events', async (req, res) => {
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
});

// Evento por ID
app.get('/api/events/:id', async (req, res) => {
  const { id } = req.params;
  
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
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend CCB corriendo en puerto ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
});