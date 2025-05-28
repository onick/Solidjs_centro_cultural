import { describe, test, expect, beforeEach } from '@jest/globals';
import Event from '../../models/Event.js';
import User from '../../models/User.js';

describe('Event Model Tests', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });
  });

  describe('Event Creation', () => {
    test('should create a valid event', async () => {
      const eventData = {
        title: 'Concierto de Prueba',
        description: 'Un concierto para testing',
        category: 'concierto',
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 90000000),
        startTime: '19:00',
        endTime: '21:00',
        location: { name: 'Auditorio Principal', address: 'Centro Cultural Banreservas' },
        capacity: { total: 200 },
        createdBy: testUser._id
      };

      const event = await Event.create(eventData);

      expect(event).toBeDefined();
      expect(event.title).toBe(eventData.title);
      expect(event.category).toBe(eventData.category);
      expect(event.capacity.available).toBe(200);
      expect(event.occupancyRate).toBe(0);
      expect(event.isUpcoming).toBe(true);
    });

    test('should fail validation with invalid data', async () => {
      const invalidEvent = {
        title: '',
        description: 'Test',
        startDate: new Date(Date.now() - 86400000),
        createdBy: testUser._id
      };

      await expect(Event.create(invalidEvent)).rejects.toThrow();
    });
  });

  describe('Event Methods', () => {
    let event;

    beforeEach(async () => {
      event = await Event.create({
        title: 'Evento de Prueba',
        description: 'Descripción de prueba',
        category: 'teatro',
        startDate: new Date(Date.now() + 86400000),
        endDate: new Date(Date.now() + 90000000),
        startTime: '20:00',
        endTime: '22:00',
        location: { name: 'Teatro Principal' },
        capacity: { total: 100 },
        createdBy: testUser._id
      });
    });

    test('should soft delete event', async () => {
      await event.softDelete(testUser._id);
      expect(event.isDeleted).toBe(true);
      expect(event.deletedBy.toString()).toBe(testUser._id.toString());
      
      const foundEvent = await Event.findById(event._id);
      expect(foundEvent).toBeNull();
    });
  });
});
