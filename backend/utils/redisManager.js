import Redis from 'ioredis';
import { EventEmitter } from 'events';

class RedisManager extends EventEmitter {
  constructor() {
    super();
    this.redis = null;
    this.subscriber = null;
    this.publisher = null;
    this.isConnected = false;
  }

  async connect() {
    try {
      const redisConfig = {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || null,
        db: process.env.REDIS_DB || 0,
        retryDelayOnFailover: 100,
        enableReadyCheck: true,
        maxRetriesPerRequest: 3,
        lazyConnect: true
      };

      this.redis = new Redis(redisConfig);
      this.subscriber = new Redis(redisConfig);
      this.publisher = new Redis(redisConfig);

      this.redis.on('connect', () => {
        console.log('✅ Redis conectado');
        this.isConnected = true;
        this.emit('connected');
      });

      this.redis.on('error', (err) => {
        console.error('❌ Error Redis:', err.message);
        this.isConnected = false;
        this.emit('error', err);
      });

      await this.redis.connect();
      await this.subscriber.connect();
      await this.publisher.connect();

      this.setupPubSub();
      return true;
    } catch (error) {
      console.error('❌ Error conectando a Redis:', error.message);
      return false;
    }
  }
  // Configurar canales pub/sub para sincronización Vue.js ↔ SolidJS
  setupPubSub() {
    const channels = [
      'ccb:events:created', 'ccb:events:updated', 'ccb:events:deleted',
      'ccb:visitors:registered', 'ccb:visitors:checkin', 'ccb:visitors:updated',
      'ccb:config:updated', 'ccb:kiosk:heartbeat', 'ccb:sync:request'
    ];

    channels.forEach(channel => {
      this.subscriber.subscribe(channel);
    });

    this.subscriber.on('message', (channel, message) => {
      try {
        const data = JSON.parse(message);
        console.log(`📡 Redis mensaje recibido [${channel}]:`, data);
        this.emit('message', { channel, data });
      } catch (error) {
        console.error('❌ Error parseando mensaje Redis:', error);
      }
    });
  }

  // ===== MÉTODOS DE CACHE =====
  
  // Cache de eventos activos con TTL inteligente
  async cacheActiveEvents(events, ttl = 300) { // 5 minutos
    try {
      const key = 'ccb:cache:events:active';
      await this.redis.setex(key, ttl, JSON.stringify(events));
      console.log(`📦 Eventos activos cached: ${events.length} items`);
      return true;
    } catch (error) {
      console.error('❌ Error cacheando eventos:', error);
      return false;
    }
  }

  async getCachedActiveEvents() {
    try {
      const key = 'ccb:cache:events:active';
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('❌ Error obteniendo eventos cached:', error);
      return null;
    }
  }

  // Cache de estadísticas del dashboard
  async cacheStats(stats, ttl = 120) { // 2 minutos
    try {
      const key = 'ccb:cache:stats:dashboard';
      await this.redis.setex(key, ttl, JSON.stringify(stats));
      return true;
    } catch (error) {
      console.error('❌ Error cacheando estadísticas:', error);
      return false;
    }
  }

  async getCachedStats() {
    try {
      const key = 'ccb:cache:stats:dashboard';
      const cached = await this.redis.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('❌ Error obteniendo stats cached:', error);
      return null;
    }
  }
  // ===== MÉTODOS DE PUB/SUB PARA SINCRONIZACIÓN =====
  
  // Notificar cambios de eventos
  async publishEventChange(action, eventData) {
    try {
      const channel = `ccb:events:${action}`;
      const message = {
        timestamp: new Date().toISOString(),
        action,
        data: eventData,
        source: 'solidjs'
      };
      await this.publisher.publish(channel, JSON.stringify(message));
      console.log(`📡 Evento publicado [${channel}]:`, action);
      return true;
    } catch (error) {
      console.error('❌ Error publicando evento:', error);
      return false;
    }
  }

  // Notificar cambios de visitantes
  async publishVisitorChange(action, visitorData) {
    try {
      const channel = `ccb:visitors:${action}`;
      const message = {
        timestamp: new Date().toISOString(),
        action,
        data: visitorData,
        source: 'solidjs'
      };
      await this.publisher.publish(channel, JSON.stringify(message));
      console.log(`📡 Visitante publicado [${channel}]:`, action);
      return true;
    } catch (error) {
      console.error('❌ Error publicando visitante:', error);
      return false;
    }
  }

  // Heartbeat de kioscos
  async publishKioskHeartbeat(kioskId, status) {
    try {
      const channel = 'ccb:kiosk:heartbeat';
      const message = {
        timestamp: new Date().toISOString(),
        kioskId,
        status,
        source: 'solidjs'
      };
      await this.publisher.publish(channel, JSON.stringify(message));
      
      // También cache el último heartbeat
      const key = `ccb:kiosk:${kioskId}:heartbeat`;
      await this.redis.setex(key, 600, JSON.stringify(message)); // 10 minutos
      
      return true;
    } catch (error) {
      console.error('❌ Error publicando heartbeat:', error);
      return false;
    }
  }

  // ===== MÉTODOS DE GESTIÓN =====
  
  // Invalidar cache específico
  async invalidateCache(pattern) {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
        console.log(`🗑️ Cache invalidado: ${keys.length} keys eliminadas`);
      }
      return keys.length;
    } catch (error) {
      console.error('❌ Error invalidando cache:', error);
      return 0;
    }
  }

  // Información del estado de Redis
  async getInfo() {
    if (!this.isConnected) return null;
    try {
      const info = await this.redis.info('memory');
      const keyCount = await this.redis.dbsize();
      return {
        connected: this.isConnected,
        keyCount,
        memory: info
      };
    } catch (error) {
      console.error('❌ Error obteniendo info Redis:', error);
      return null;
    }
  }

  // Desconectar Redis
  async disconnect() {
    try {
      if (this.redis) await this.redis.disconnect();
      if (this.subscriber) await this.subscriber.disconnect();
      if (this.publisher) await this.publisher.disconnect();
      this.isConnected = false;
      console.log('🔌 Redis desconectado correctamente');
    } catch (error) {
      console.error('❌ Error desconectando Redis:', error);
    }
  }
}

// Singleton instance
const redisManager = new RedisManager();
export default redisManager;
