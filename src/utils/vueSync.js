// Utilidad para sincronización con el sistema Vue.js existente
import io from 'socket.io-client';

let socket = null;

export const initializeSync = () => {
  // Conectar al backend Node.js para sincronización
  socket = io('http://localhost:3080');
  
  socket.on('connect', () => {
    console.log('🔗 Conectado al sistema de sincronización');
  });
  
  socket.on('sync_response', (data) => {
    console.log('📥 Respuesta de sincronización:', data);
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Desconectado del sistema de sincronización');
  });
};

export const syncWithVueSystem = async (action, data) => {
  try {
    // Comunicación directa con el sistema Vue.js
    const response = await fetch(`http://localhost:8080/api/v1/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    return await response.json();
  } catch (error) {
    console.error('❌ Error de sincronización con Vue.js:', error);
    throw error;
  }
};

export const requestSync = (data) => {
  if (socket) {
    socket.emit('sync_request', data);
  }
};
