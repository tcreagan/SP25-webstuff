//gpt generated but jsut used to create a files 
import * as eventService from '../services/eventService';
import { Models } from '../db/initConnection';

const Event = Models.Event;

jest.mock('../db/initConnection');  // Mock the database models

describe('Event Service', () => {
  it('should fetch all events', async () => {
    Event.findAll = jest.fn().mockResolvedValue([{ id: 1, event_log: 'Test Event' }]);
    const events = await eventService.getAllEvents();
    expect(events.length).toBeGreaterThan(0);
  });

  it('should throw error if event is not found', async () => {
    Event.find = jest.fn().mockResolvedValue(null);
    await expect(eventService.getEventById(1)).rejects.toThrow('Event not found');
  });
});
