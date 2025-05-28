import mongoose from 'mongoose';

const configurationSchema = new mongoose.Schema({
  // Configuración general del sistema
  general: {
    siteName: { type: String, default: 'Centro Cultural Banreservas' },
    timezone: { type: String, default: 'America/Santo_Domingo' },
    language: { type: String, default: 'es', enum: ['es', 'en', 'fr'] },
    currency: { type: String, default: 'DOP', enum: ['DOP', 'USD', 'EUR'] },
    dateFormat: { type: String, default: 'DD/MM/YYYY' },
    timeFormat: { type: String, default: '24h', enum: ['12h', '24h'] }
  },

  // Configuración de eventos y kioscos
  events: {
    defaultCapacity: { type: Number, default: 100 },
    registrationDeadlineHours: { type: Number, default: 24 },
    allowWalkIns: { type: Boolean, default: false },
    requireApproval: { type: Boolean, default: false },
    categories: [{ id: String, name: String, color: String, icon: String, isActive: { type: Boolean, default: true } }]
  },

  kiosks: {
    global: {
      sessionTimeout: { type: Number, default: 300 },
      fontSize: { type: String, default: 'medium', enum: ['small', 'medium', 'large'] },
      theme: { type: String, default: 'ccb', enum: ['ccb', 'light', 'dark', 'high-contrast'] },
      autoRefresh: { type: Number, default: 30 },
      showClock: { type: Boolean, default: true },
      language: { type: String, default: 'es' }
    },
    individual: [{
      kioskId: { type: String, required: true, unique: true },
      name: String,
      location: String,
      isActive: { type: Boolean, default: true },
      lastHeartbeat: Date,
      config: { sessionTimeout: Number, fontSize: String, theme: String, autoRefresh: Number, customMessage: String }
    }]
  }
,

  // Configuración de notificaciones y seguridad
  notifications: {
    email: {
      enabled: { type: Boolean, default: true },
      smtp: { host: String, port: Number, user: String, password: String, secure: Boolean },
      templates: { registration: String, reminder: String, cancellation: String }
    },
    sms: { enabled: { type: Boolean, default: false }, provider: String, apiKey: String },
    push: { enabled: { type: Boolean, default: false }, serverKey: String }
  },

  security: {
    maxLoginAttempts: { type: Number, default: 5 },
    lockoutDuration: { type: Number, default: 900 }, // 15 minutos
    sessionTimeout: { type: Number, default: 3600 }, // 1 hora
    passwordPolicy: {
      minLength: { type: Number, default: 6 },
      requireNumbers: { type: Boolean, default: false },
      requireSymbols: { type: Boolean, default: false }
    },
    twoFactorAuth: { enabled: { type: Boolean, default: false } }
  },

  // Configuración de marca y apariencia
  branding: {
    logo: { url: String, alt: String },
    favicon: String,
    colors: {
      primary: { type: String, default: '#F99D2A' }, // Naranja CCB
      secondary: { type: String, default: '#00BDF2' }, // Azul CCB
      accent: { type: String, default: '#474C55' } // Gris CCB
    },
    customCSS: String
  },

  // Metadatos de configuración
  version: { type: String, default: '1.0.0' },
  lastBackup: Date,
  backupEnabled: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  collection: 'configuration' // Singleton collection
});

// Solo permitir un documento de configuración
configurationSchema.statics.getSingleton = async function() {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({});
  }
  return config;
};

const Configuration = mongoose.model('Configuration', configurationSchema);
export default Configuration;
