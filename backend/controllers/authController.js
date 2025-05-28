import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Usuarios de prueba (en producción esto vendría de la base de datos)
const users = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@ccb.com',
    name: 'Administrador CCB',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    permissions: [
      'view_dashboard', 'manage_events', 'manage_visitors', 
      'manage_users', 'view_reports', 'manage_settings'
    ]
  },
  {
    id: 2,
    username: 'staff',
    email: 'staff@ccb.com',
    name: 'Personal CCB',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'staff',
    permissions: [
      'view_dashboard', 'view_events', 'manage_visitors', 'view_reports'
    ]
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'ccb-secret-key-2025';

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validación
    if (!username || !password) {
      return res.status(400).json({
        message: 'Usuario y contraseña son requeridos'
      });
    }

    // Buscar usuario
    const user = users.find(u => u.username === username || u.email === username);
    if (!user) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Respuesta sin contraseña
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Registro de nuevos usuarios
export const register = async (req, res) => {
  try {
    const { username, email, name, password, role = 'staff' } = req.body;

    // Validaciones
    if (!username || !email || !name || !password) {
      return res.status(400).json({
        message: 'Todos los campos son requeridos'
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = users.find(u => u.username === username || u.email === email);
    if (existingUser) {
      return res.status(409).json({
        message: 'Usuario o email ya existe'
      });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const newUser = {
      id: users.length + 1,
      username,
      email,
      name,
      password: hashedPassword,
      role,
      permissions: role === 'admin' 
        ? ['view_dashboard', 'manage_events', 'manage_visitors', 'manage_users', 'view_reports', 'manage_settings']
        : ['view_dashboard', 'view_events', 'manage_visitors', 'view_reports']
    };

    users.push(newUser);

    // Respuesta sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Validar token
export const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    res.json({ valid: true, user: { id: user.id, username: user.username, role: user.role } });

  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Obtener perfil del usuario
export const getProfile = async (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
