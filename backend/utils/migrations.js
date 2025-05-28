import mongoose from 'mongoose';
import Event from '../models/Event.js';
import Visitor from '../models/Visitor.js';
import User from '../models/User.js';
import Configuration from '../models/Configuration.js';

class DataMigration {
  constructor() {
    this.migratedCount = { users: 0, events: 0, visitors: 0, configurations: 0 };
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ccb_solidjs';
      await mongoose.connect(mongoUri);
      console.log('✅ Conectado a MongoDB para migración');
      return true;
    } catch (error) {
      console.error('❌ Error conectando a MongoDB:', error.message);
      return false;
    }
  }

  async createDefaultUsers() {
    console.log('👤 Creando usuarios por defecto...');
    
    const defaultUsers = [
      {
        name: 'Administrador CCB',
        email: 'admin@banreservas.com',
        password: 'admin123',
        role: 'admin',
        permissions: {
          events: { read: true, create: true, update: true, delete: true },
          visitors: { read: true, create: true, update: true, delete: true },
          reports: { read: true, export: true },
          config: { read: true, update: true },
          users: { read: true, create: true, update: true, delete: true }
        }
      },
      {
        name: 'Personal CCB',
        email: 'staff@banreservas.com',
        password: 'staff123',
        role: 'staff',
        permissions: {
          events: { read: true, create: true, update: true, delete: false },
          visitors: { read: true, create: true, update: true, delete: false },
          reports: { read: true, export: false },
          config: { read: true, update: false },
          users: { read: false, create: false, update: false, delete: false }
        }
      }
    ];

    for (const userData of defaultUsers) {
      try {
        const existingUser = await User.findOne({ email: userData.email });
        if (!existingUser) {
          await User.create(userData);
          this.migratedCount.users++;
          console.log(`   ✅ Usuario creado: ${userData.email}`);
        } else {
          console.log(`   ⚠️  Usuario ya existe: ${userData.email}`);
        }
      } catch (error) {
        console.error(`   ❌ Error creando usuario ${userData.email}:`, error.message);
      }
    }
  }

  async createSampleEvents() {
    console.log('🎭 Creando eventos de ejemplo...');
    
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('   ⚠️  No se encontró usuario admin, saltando eventos');
      return;
    }

    const sampleEvents = [
      {
        title: 'Concierto de Jazz Dominicano',
        description: 'Una noche de jazz con los mejores músicos del país.',
        category: 'concierto',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // En 7 días
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // +3 horas
        startTime: '20:00',
        endTime: '23:00',
        location: { name: 'Auditorio Principal', address: 'Centro Cultural Banreservas' },
        capacity: { total: 300 },
        status: 'published',
        pricing: { isFree: false, generalPrice: 500, currency: 'DOP' },
        culturalData: {
          artist: { name: 'Conjunto Jazz RD', country: 'República Dominicana' },
          genre: ['jazz', 'música latina'],
          ageRestriction: 'all-ages',
          language: 'español'
        },
        tags: ['jazz', 'música', 'dominicano', 'concierto'],
        createdBy: adminUser._id
      },
      {
        title: 'Exposición: Arte Contemporáneo Caribeño',
        description: 'Muestra de arte contemporáneo de artistas del Caribe.',
        category: 'exposicion',
        startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
        startTime: '09:00',
        endTime: '18:00',
        location: { name: 'Galería Principal', room: 'Sala A y B' },
        capacity: { total: 50 },
        status: 'published',
        pricing: { isFree: true },
        culturalData: {
          genre: ['arte contemporáneo', 'pintura', 'escultura'],
          ageRestriction: 'all-ages',
          language: 'español'
        },
        tags: ['arte', 'exposición', 'caribe', 'contemporáneo'],
        createdBy: adminUser._id
      }
    ];

    for (const eventData of sampleEvents) {
      try {
        const existingEvent = await Event.findOne({ title: eventData.title });
        if (!existingEvent) {
          await Event.create(eventData);
          this.migratedCount.events++;
          console.log(`   ✅ Evento creado: ${eventData.title}`);
        } else {
          console.log(`   ⚠️  Evento ya existe: ${eventData.title}`);
        }
      } catch (error) {
        console.error(`   ❌ Error creando evento ${eventData.title}:`, error.message);
      }
    }
  }

  async createConfiguration() {
    console.log('⚙️  Creando configuración inicial...');
    
    try {
      const config = await Configuration.getSingleton();
      this.migratedCount.configurations++;
      console.log('   ✅ Configuración inicial creada');
    } catch (error) {
      console.error('   ❌ Error creando configuración:', error.message);
    }
  }

  async runAll() {
    console.log('🚀 Iniciando migración de datos...');
    console.log('=====================================');
    
    const connected = await this.connect();
    if (!connected) {
      process.exit(1);
    }

    await this.createDefaultUsers();
    await this.createSampleEvents();
    await this.createConfiguration();

    console.log('');
    console.log('📊 Resumen de migración:');
    console.log(`   • Usuarios: ${this.migratedCount.users}`);
    console.log(`   • Eventos: ${this.migratedCount.events}`);
    console.log(`   • Visitantes: ${this.migratedCount.visitors}`);
    console.log(`   • Configuraciones: ${this.migratedCount.configurations}`);
    console.log('');
    console.log('✅ Migración completada exitosamente');
    
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
}

// Ejecutar migración si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  const migration = new DataMigration();
  migration.runAll().catch(error => {
    console.error('❌ Error en migración:', error);
    process.exit(1);
  });
}

export default DataMigration;
