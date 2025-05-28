import axios from 'axios';

// Configuración base de la API
const API_URL = 'http://localhost:3080/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para incluir token en las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Servicios de eventos
export const eventService = {
  getAll: (params = {}) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  register: (eventId) => api.post(`/events/${eventId}/register`),
  unregister: (eventId) => api.post(`/events/${eventId}/unregister`),
  getAttendees: (eventId) => api.get(`/events/${eventId}/attendees`)
};

// Servicios de visitantes
export const visitorService = {
  getAll: (params = {}) => api.get('/visitors', { params }),
  getById: (id) => api.get(`/visitors/${id}`),
  create: (data) => api.post('/visitors', data),
  update: (id, data) => api.put(`/visitors/${id}`, data),
  delete: (id) => api.delete(`/visitors/${id}`),
  getHistory: (id) => api.get(`/visitors/${id}/history`),
  checkIn: (visitorId, eventId) => api.post(`/visitors/${visitorId}/checkin`, { eventId }),
  registerForEvent: (data) => api.post('/visitors/register', data)
};

// Servicios de usuarios (administración)
export const userService = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  changePassword: (id, passwords) => api.post(`/users/${id}/change-password`, passwords)
};

// Servicios de configuración
export const configService = {
  getAll: () => api.get('/configuration'),
  get: (key) => api.get(`/configuration/${key}`),
  update: (key, value) => api.put(`/configuration/${key}`, { value }),
  getTheme: () => api.get('/configuration/theme'),
  updateTheme: (theme) => api.put('/configuration/theme', theme)
};

// Servicios de estadísticas
export const statsService = {
  getDashboard: () => api.get('/stats/dashboard'),
  getEventStats: (eventId) => api.get(`/stats/events/${eventId}`),
  getVisitorStats: () => api.get('/stats/visitors'),
  getMonthlyStats: () => api.get('/stats/monthly'),
  getReports: (type, params = {}) => api.get(`/stats/reports/${type}`, { params })
};

export default api;