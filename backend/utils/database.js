import mongoose from 'mongoose';
import redisManager from './redisManager.js';

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ccb_solidjs';
      
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
        bufferCommands: false,
        bufferMaxEntries: 0
      };

      console.log('🔄 Conectando a MongoDB...');
      await mongoose.connect(mongoUri, options);
      
      this.isConnected = true;
      this.connectionRetries = 0;
      
      console.log('✅ MongoDB conectado exitosamente');
      console.log(`📊 Base de datos: ${mongoose.connection.name}`);
      
      this.setupEventListeners();
      
      // Conectar Redis después de MongoDB
      await redisManager.connect();
      
      return true;
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error.message);
      this.isConnected = false;
      
      if (this.connectionRetries < this.maxRetries) {
        this.connectionRetries++;
        console.log(`🔄 Reintentando conexión (${this.connectionRetries}/${this.maxRetries})...`);
        setTimeout(() => this.connect(), 5000);
      } else {
        console.error('❌ Máximo número de reintentos alcanzado');
        process.exit(1);
      }
      
      return false;
    }
  }

  setupEventListeners() {
    mongoose.connection.on('connected', () => {
      console.log('🟢 MongoDB conectado');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 Error MongoDB:', err.message);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('🟡 MongoDB desconectado');
      this.isConnected = false;
    });
  }

  // Migración de datos simulados a MongoDB
  async runMigrations() {
    try {
      console.log('🔄 Ejecutando migraciones...');
      
      // Importar modelos
      const Event = (await import('../models/Event.js')).default;
      const Visitor = (await import('../models/Visitor.js')).default;
      const User = (await import('../models/User.js')).default;
      const Configuration = (await import('../models/Configuration.js')).default;
      
      // Verificar si ya existen datos
      const eventCount = await Event.countDocuments();
      const userCount = await User.countDocuments();
      
      if (eventCount === 0) {
        await this.seedInitialData();
      }
      
      if (userCount === 0) {
        await this.createDefaultUsers();
      }
      
      // Crear configuración inicial
      await Configuration.getSingleton();
      
      console.log('✅ Migraciones completadas');
      return true;
    } catch (error) {
      console.error('❌ Error en migraciones:', error);
      return false;
    }
  }

  async seedInitialData() {
    console.log('🌱 Sembrando datos iniciales...');
    // Implementaremos la siembra de datos aquí
  }

  async createDefaultUsers() {
    console.log('👤 Creando usuarios por defecto...');
    // Implementaremos la creación de usuarios por defecto
  }

  async disconnect() {
    try {
      await redisManager.disconnect();
      await mongoose.disconnect();
      console.log('🔌 Base de datos desconectada correctamente');
    } catch (error) {
      console.error('❌ Error desconectando base de datos:', error);
    }
  }
}

const databaseManager = new DatabaseManager();
export default databaseManager;
