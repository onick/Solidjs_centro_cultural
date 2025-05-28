import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

let mongoServer;

// Setup antes de todos los tests
beforeAll(async () => {
  // Crear servidor MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Conectar mongoose al servidor de test
  await mongoose.connect(mongoUri);
  
  console.log('🧪 Test database conectada');
});

// Cleanup después de cada test
afterEach(async () => {
  // Limpiar todas las colecciones
  const collections = mongoose.connection.collections;
  
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Cleanup después de todos los tests
afterAll(async () => {
  // Cerrar conexión mongoose
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  
  // Parar servidor MongoDB
  await mongoServer.stop();
  
  console.log('🧪 Test database desconectada');
});

// Mock de Redis para tests
jest.mock('../utils/redisManager.js', () => ({
  default: {
    isConnected: true,
    connect: jest.fn(() => Promise.resolve(true)),
    cacheActiveEvents: jest.fn(() => Promise.resolve(true)),
    getCachedActiveEvents: jest.fn(() => Promise.resolve(null)),
    publishEventChange: jest.fn(() => Promise.resolve(true)),
    publishVisitorChange: jest.fn(() => Promise.resolve(true)),
    invalidateCache: jest.fn(() => Promise.resolve(0)),
    disconnect: jest.fn(() => Promise.resolve())
  }
}));
