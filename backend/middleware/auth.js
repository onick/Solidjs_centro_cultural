import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'ccb-secret-key-2025';

// Middleware de autenticación
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    
    req.user = user;
    next();
  });
};

// Middleware para verificar roles
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'No tienes permisos suficientes',
        required: userRoles,
        current: req.user.role
      });
    }

    next();
  };
};

// Middleware para verificar permisos específicos
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    // Los admin tienen todos los permisos
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar permiso específico (esto requeriría consultar la DB)
    // Por ahora simulamos la verificación
    const userPermissions = getUserPermissions(req.user.role);
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ 
        message: `Permiso requerido: ${permission}`,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Helper para obtener permisos por rol
const getUserPermissions = (role) => {
  const permissions = {
    admin: [
      'view_dashboard', 'manage_events', 'manage_visitors', 
      'manage_users', 'view_reports', 'manage_settings'
    ],
    staff: [
      'view_dashboard', 'view_events', 'manage_visitors', 'view_reports'
    ],
    viewer: [
      'view_dashboard', 'view_events', 'view_visitors', 'view_reports'
    ]
  };

  return permissions[role] || [];
};
