// Funciones auxiliares para manejo de fechas

export const formatDate = (date) => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('es-DO', options);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleDateString('es-DO', options);
};

export const formatTime = (date) => {
  if (!date) return '';
  
  const options = { 
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return new Date(date).toLocaleTimeString('es-DO', options);
};

export const formatDateShort = (date) => {
  if (!date) return '';
  
  const options = { 
    month: 'short', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('es-DO', options);
};

export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  
  return today.toDateString() === compareDate.toDateString();
};

export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const compareDate = new Date(date);
  
  return tomorrow.toDateString() === compareDate.toDateString();
};

export const isPast = (date) => {
  return new Date(date) < new Date();
};

export const isFuture = (date) => {
  return new Date(date) > new Date();
};

export const getDaysUntil = (date) => {
  const now = new Date();
  const eventDate = new Date(date);
  const diffTime = eventDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

export const getRelativeTime = (date) => {
  const days = getDaysUntil(date);
  
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days === -1) return 'Ayer';
  if (days > 0 && days <= 7) return `En ${days} días`;
  if (days < 0) return 'Pasado';
  
  return formatDate(date);
};