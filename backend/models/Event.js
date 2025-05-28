import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  // Información básica
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true,
    maxLength: [100, 'El título no puede superar 100 caracteres']
  },
  
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxLength: [1000, 'La descripción no puede superar 1000 caracteres']
  },
  
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['concierto', 'teatro', 'exposicion', 'conferencia', 'taller', 'festival', 'otro'],
    default: 'otro'
  }
,
  
  // Fechas y horarios
  startDate: {
    type: Date,
    required: [true, 'La fecha de inicio es obligatoria'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'La fecha de inicio debe ser futura'
    }
  },
  
  endDate: {
    type: Date,
    required: [true, 'La fecha de fin es obligatoria'],
    validate: {
      validator: function(value) {
        return value > this.startDate;
      },
      message: 'La fecha de fin debe ser posterior a la fecha de inicio'
    }
  },
  
  startTime: {
    type: String,
    required: [true, 'La hora de inicio es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  },
  
  endTime: {
    type: String,
    required: [true, 'La hora de fin es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)']
  }
,
  
  // Ubicación y capacidad
  location: {
    name: {
      type: String,
      required: [true, 'El nombre de la ubicación es obligatorio'],
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    room: {
      type: String,
      trim: true
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  
  capacity: {
    total: {
      type: Number,
      required: [true, 'La capacidad total es obligatoria'],
      min: [1, 'La capacidad debe ser al menos 1'],
      max: [10000, 'La capacidad no puede superar 10,000']
    },
    reserved: {
      type: Number,
      default: 0,
      min: 0
    },
    available: {
      type: Number,
      default: function() {
        return this.capacity.total;
      }
    }
  }
,
  
  // Información financiera y estado
  pricing: {
    isFree: { type: Boolean, default: true },
    generalPrice: { type: Number, default: 0, min: [0, 'El precio no puede ser negativo'] },
    discountPrice: { type: Number, default: 0, min: [0, 'El precio con descuento no puede ser negativo'] },
    currency: { type: String, default: 'DOP', enum: ['DOP', 'USD', 'EUR'] }
  },
  
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed', 'postponed'],
    default: 'draft',
    required: true
  },
  
  isActive: { type: Boolean, default: true },
  requiresRegistration: { type: Boolean, default: true },
  allowWalkIns: { type: Boolean, default: false },
  
  // Metadatos culturales
  culturalData: {
    artist: { name: String, biography: String, country: String },
    genre: [String],
    ageRestriction: { type: String, enum: ['all-ages', '13+', '16+', '18+'], default: 'all-ages' },
    language: { type: String, default: 'español' },
    duration: { hours: { type: Number, min: 0, max: 24 }, minutes: { type: Number, min: 0, max: 59 } }
  },
  
  tags: [{ type: String, trim: true, lowercase: true }],
  
  // Media y estadísticas
  media: {
    poster: { url: String, alt: String },
    gallery: [{ url: String, alt: String, type: { type: String, enum: ['image', 'video'] } }]
  },
  
  stats: {
    views: { type: Number, default: 0 },
    registrations: { type: Number, default: 0 },
    checkIns: { type: Number, default: 0 },
    rating: { average: { type: Number, default: 0, min: 0, max: 5 }, count: { type: Number, default: 0 } }
  }
,
  
  // Referencias y auditoría
  registeredVisitors: [{
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor' },
    registrationDate: { type: Date, default: Date.now },
    checkedIn: { type: Boolean, default: false },
    checkInTime: Date,
    status: { type: String, enum: ['registered', 'confirmed', 'cancelled', 'attended'], default: 'registered' }
  }],
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Soft delete
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para optimización
eventSchema.index({ title: 'text', description: 'text', tags: 'text' });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ 'location.name': 1 });
eventSchema.index({ createdBy: 1, isDeleted: 1 });
eventSchema.index({ status: 1, startDate: 1, isDeleted: 1 });
eventSchema.index({ category: 1, startDate: 1, isDeleted: 1 });

// Virtuals
eventSchema.virtual('occupancyRate').get(function() {
  if (this.capacity.total === 0) return 0;
  return Math.round((this.capacity.reserved / this.capacity.total) * 100);
});

eventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

eventSchema.virtual('fullLocation').get(function() {
  let location = this.location.name;
  if (this.location.room) location += ` - ${this.location.room}`;
  if (this.location.address) location += ` (${this.location.address})`;
  return location;
});

// Middleware
eventSchema.pre('save', function(next) {
  this.capacity.available = this.capacity.total - this.capacity.reserved;
  if (this.endDate <= this.startDate) {
    next(new Error('La fecha de fin debe ser posterior a la fecha de inicio'));
  }
  if (this.registeredVisitors) {
    this.stats.registrations = this.registeredVisitors.filter(rv => rv.status !== 'cancelled').length;
    this.stats.checkIns = this.registeredVisitors.filter(rv => rv.checkedIn).length;
    this.capacity.reserved = this.stats.registrations;
  }
  next();
});

eventSchema.pre(/^find/, function(next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

// Métodos de instancia
eventSchema.methods.softDelete = function(userId) {
  this.isDeleted = true;
  this.deletedAt = new Date();
  this.deletedBy = userId;
  return this.save();
};

eventSchema.methods.addRegistration = function(visitorId, status = 'registered') {
  const existingRegistration = this.registeredVisitors.find(
    rv => rv.visitor.toString() === visitorId.toString()
  );
  if (existingRegistration) throw new Error('El visitante ya está registrado');
  if (this.capacity.available <= 0) throw new Error('No hay capacidad disponible');
  
  this.registeredVisitors.push({ visitor: visitorId, status, registrationDate: new Date() });
  return this.save();
};

eventSchema.methods.checkInVisitor = function(visitorId) {
  const registration = this.registeredVisitors.find(
    rv => rv.visitor.toString() === visitorId.toString()
  );
  if (!registration) throw new Error('Visitante no registrado');
  if (registration.checkedIn) throw new Error('Ya hizo check-in');
  
  registration.checkedIn = true;
  registration.checkInTime = new Date();
  registration.status = 'attended';
  return this.save();
};

// Métodos estáticos
eventSchema.statics.findUpcoming = function(limit = 10) {
  return this.find({ startDate: { $gte: new Date() }, status: 'published' })
    .sort({ startDate: 1 }).limit(limit).populate('createdBy', 'name email');
};

const Event = mongoose.model('Event', eventSchema);
export default Event;
