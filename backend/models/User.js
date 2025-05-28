import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true,
    maxLength: [100, 'El nombre no puede superar 100 caracteres']
  },
  
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  
  password: {
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minLength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  
  role: {
    type: String,
    enum: ['admin', 'staff', 'volunteer', 'kiosk'],
    default: 'staff',
    required: true
  }
,
  
  // Sistema de permisos granular por funcionalidad
  permissions: {
    events: { read: { type: Boolean, default: true }, create: { type: Boolean, default: false }, 
             update: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    visitors: { read: { type: Boolean, default: true }, create: { type: Boolean, default: false }, 
               update: { type: Boolean, default: false }, delete: { type: Boolean, default: false } },
    reports: { read: { type: Boolean, default: false }, export: { type: Boolean, default: false } },
    config: { read: { type: Boolean, default: false }, update: { type: Boolean, default: false } },
    users: { read: { type: Boolean, default: false }, create: { type: Boolean, default: false }, 
            update: { type: Boolean, default: false }, delete: { type: Boolean, default: false } }
  },
  
  // Estado y configuración del usuario
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  
  // Configuración específica para usuarios kiosk
  kioskConfig: {
    kioskId: String,
    location: String,
    autoLogout: { type: Number, default: 300 }, // segundos
    theme: { type: String, enum: ['light', 'dark', 'high-contrast'], default: 'light' }
  },
  
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true, transform: function(doc, ret) { delete ret.password; return ret; } },
  toObject: { virtuals: true }
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ isDeleted: 1 });

// Middleware para hash de password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para comparar passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
