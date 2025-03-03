import DBConnector from '../dbConnector';  // Adjust the path as needed
// src/db/services/eventService.ts

export class EventService {
    // Method to get all events from the database
    static async getAllEvents() {
      const sql = `SELECT * FROM events`;  // query needs modification
      const result = await DBConnector.runQuery(sql); // Assuming DBConnector has a runQuery method
      return result;
    }
  
    // Method to get a specific event by ID from the database
    static async getEventById(eventId: number) {
      const sql = `SELECT * FROM events WHERE id = ?`;  // query needs modification
      const result = await DBConnector.runQuery(sql, [eventId]);
      return result;
    }
  }
  
