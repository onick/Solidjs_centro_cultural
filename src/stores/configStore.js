(config)
        });

        if (!response.ok) {
          throw new Error('Error al actualizar configuración del kiosco');
        }

        const data = await response.json();
        
        // Actualizar kiosco en el estado local
        setConfigState('kioskConfigs', prev => 
          prev.map(k => k.id === kioskId ? data.kiosk : k)
        );
      } catch (error) {
        console.error('Error actualizando configuración del kiosco:', error);
        setConfigState('error', error.message);
        throw error;
      } finally {
        setConfigState('loading', false);
      }
    },

    async restartKiosk(kioskId) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config/kiosks/${kioskId}/restart`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al reiniciar kiosco');
        }

        return await response.json();
      } catch (error) {
        console.error('Error reiniciando kiosco:', error);
        throw error;
      }
    },

    async getKioskStats() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config/kiosks/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al obtener estadísticas de kioscos');
        }

        return await response.json();
      } catch (error) {
        console.error('Error obteniendo estadísticas de kioscos:', error);
        throw error;
      }
    },

    async exportSystemConfig() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config/export`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al exportar configuración');
        }

        // Descargar archivo de configuración
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ccb-system-config-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error exportando configuración:', error);
        throw error;
      }
    },

    async resetToDefaults() {
      setConfigState('loading', true);
      setConfigState('error', null);
      
      try {
        // Cargar configuración por defecto desde el servidor
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/config/system/defaults`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar configuración por defecto');
        }

        const data = await response.json();
        setConfigState('config', data.config);
      } catch (error) {
        console.error('Error restableciendo configuración:', error);
        setConfigState('error', error.message);
        throw error;
      } finally {
        setConfigState('loading', false);
      }
    }
  };

  export { configStore };
