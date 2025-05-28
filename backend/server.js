import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Importar rutas
import authRoutes from './routes/auth.js';
import eventsRoutes from './routes/events.js';
import visitorsRoutes from './routes/visitors.js';
import reportsRoutes from './routes/reports.js';
import configRoutes from './routes/config.js';

// Configuración
const app = express();
const PORT = process.env.PORT || 3080;
const VUE_SYSTEM_URL = 'http://localhost:8080';

// Servidor HTTP y Socket.IO
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:8080'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware de seguridad
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/visitors', visitorsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/config', configRoutes);

// Rutas de estado
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'CCB SolidJS Backend',
    port: PORT
  });
});

// Sistema de sincronización con Vue.js
app.get('/api/sync/vue-system', async (req, res) => {
  try {
    // Aquí implementaremos la sincronización con el sistema Vue.js
    res.json({ 
      message: 'Sincronización con sistema Vue.js',
      vue_system_url: VUE_SYSTEM_URL,
      status: 'ready'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// WebSocket para sincronización en tiempo real
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  
  socket.on('sync_request', (data) => {
    // Manejar solicitudes de sincronización
    console.log('Solicitud de sincronización:', data);
    socket.emit('sync_response', { status: 'acknowledged' });
  });
  
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 CCB SolidJS Backend iniciado en puerto ${PORT}`);
  console.log(`📡 Sistema Vue.js en: ${VUE_SYSTEM_URL}`);
  console.log(`🔄 WebSocket habilitado para sincronización`);
});

export default app;
