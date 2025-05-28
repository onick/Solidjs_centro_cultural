import { createStore } from 'solid-js/store';

// Estado global de la aplicación
const [appStore, setAppStore] = createStore({
  // Sistema
  isLoading: false,
  isOnline: true,
  lastSync: null,
  
  // Usuario actual
  user: null,
  isAuthenticated: false,
  
  // Sistema Vue.js
  vueSystemStatus: 'unknown',
  syncEnabled: true,
  
  // Configuración
  config: {
    apiUrl: 'http://localhost:3080',
    vueApiUrl: 'http://localhost:8080/api/v1',
    wsUrl: 'ws://localhost:3080',
  }
});

// Acciones del store
export const appActions = {
  // Sistema
  setLoading: (loading) => setAppStore('isLoading', loading),
  setOnlineStatus: (status) => setAppStore('isOnline', status),
  updateLastSync: () => setAppStore('lastSync', new Date()),
  
  // Usuario
  setUser: (user) => {
    setAppStore('user', user);
    setAppStore('isAuthenticated', !!user);
  },
  logout: () => {
    setAppStore('user', null);
    setAppStore('isAuthenticated', false);
  },
  
  // Sincronización Vue.js
  setVueSystemStatus: (status) => setAppStore('vueSystemStatus', status),
  toggleSync: () => setAppStore('syncEnabled', !appStore.syncEnabled),
  
  // Configuración
  updateConfig: (newConfig) => setAppStore('config', { ...appStore.config, ...newConfig }),
};

export default appStore;
