import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema({
  // Información personal básica
  personalInfo: {
    firstName: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxLength: [50, 'El nombre no puede superar 50 caracteres']
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
      maxLength: [50, 'El apellido no puede superar 50 caracteres']
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    phone: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      match: [/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido']
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ['masculino', 'femenino', 'otro', 'prefiero-no-decir'],
      default: 'prefiero-no-decir'
    },
    nationality: { type: String, default: 'Dominicana' }
  }
,

  // Información de contacto y dirección
  contactInfo: {
    address: {
      street: String,
      city: String,
      province: String,
      country: { type: String, default: 'República Dominicana' },
      postalCode: String
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },

  // Código único de registro para kioscos
  registrationCode: {
    type: String,
    unique: true,
    required: true,
    uppercase: true,
    match: [/^[A-Z0-9]{8}$/, 'Código de formato inválido']
  },

  // Intereses culturales
  culturalProfile: {
    interests: [{
      type: String,
      enum: ['música', 'teatro', 'danza', 'artes visuales', 'literatura', 'cine', 'fotografía', 'artesanía', 'historia', 'educación']
    }],
    preferredLanguage: { type: String, default: 'español' },
    accessibility: {
      wheelchairAccess: { type: Boolean, default: false },
      hearingAssistance: { type: Boolean, default: false },
      visualAssistance: { type: Boolean, default: false },
      other: String
    },
    communicationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      phone: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false }
    }
  }
,

  // Estado y estadísticas del visitante
  status: {
    type: String,
    enum: ['active', 'inactive', 'blocked', 'pending'],
    default: 'active'
  },

  stats: {
    totalEvents: { type: Number, default: 0 },
    eventsAttended: { type: Number, default: 0 },
    noShows: { type: Number, default: 0 },
    lastVisit: Date,
    firstVisit: { type: Date, default: Date.now },
    favoriteCategories: [String],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },

  // Historial de eventos
  eventHistory: [{
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    registrationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['registered', 'confirmed', 'attended', 'cancelled', 'no-show'],
      default: 'registered'
    },
    checkInTime: Date,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  }],

  // Auditoría y soft delete
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización de consultas
visitorSchema.index({ 'personalInfo.email': 1 });
visitorSchema.index({ registrationCode: 1 });
visitorSchema.index({ 'personalInfo.firstName': 'text', 'personalInfo.lastName': 'text', 'personalInfo.email': 'text' });
visitorSchema.index({ status: 1, isDeleted: 1 });
visitorSchema.index({ 'culturalProfile.interests': 1 });
visitorSchema.index({ 'stats.lastVisit': -1 });

// Virtuals - campos calculados
visitorSchema.virtual('fullName').get(function() {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

visitorSchema.virtual('age').get(function() {
  if (!this.personalInfo.dateOfBirth) return null;
  return Math.floor((new Date() - this.personalInfo.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

visitorSchema.virtual('attendanceRate').get(function() {
  if (this.stats.totalEvents === 0) return 0;
  return Math.round((this.stats.eventsAttended / this.stats.totalEvents) * 100);
});

// Middleware
visitorSchema.pre('save', function(next) {
  // Generar código de registro si no existe
  if (!this.registrationCode) {
    this.registrationCode = this.generateRegistrationCode();
  }
  
  // Actualizar estadísticas
  if (this.eventHistory) {
    this.stats.totalEvents = this.eventHistory.length;
    this.stats.eventsAttended = this.eventHistory.filter(eh => eh.status === 'attended').length;
    this.stats.noShows = this.eventHistory.filter(eh => eh.status === 'no-show').length;
    
    const lastEvent = this.eventHistory
      .filter(eh => eh.status === 'attended')
      .sort((a, b) => b.checkInTime - a.checkInTime)[0];
    if (lastEvent) {
      this.stats.lastVisit = lastEvent.checkInTime;
    }
  }
  
  next();
});

visitorSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Métodos de instancia
visitorSchema.methods.generateRegistrationCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const Visitor = mongoose.model('Visitor', visitorSchema);
export default Visitor;
