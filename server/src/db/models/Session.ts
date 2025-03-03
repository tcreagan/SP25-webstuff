/**
 * Represents a session object from the database
 * 
 * Created By: [Your Name]
 */

import { BelongsTo, Column, Model, Required } from "./Model";
import { User } from "./User";
import DBConnector from "../dbConnector";

export class Session extends Model {
  @Column
  @Required
  user_id?: number;  // Foreign key to reference the user this session belongs to

  @Column
  @Required
  session_token?: string;  // Token for the session

  @Column
  @Required
  created_at?: Date;  // When the session was created

  @Column
  @Required
  refresh_token?: string; // refresh token

  @Column
  @Required
  expires_at?: Date;  // When the session expires

  @BelongsTo(() => User, "user_id")
  user?: User;  // Relationship: session belongs to a user

  // Implement the findById method
  static async findById(sessionId: string) {
    const sql = `SELECT * FROM Session WHERE id = ?`;
    const result = await DBConnector.runQuery(sql, [sessionId]);

    if (result.length === 0) {
      return null;
    }

    return result[0];  // Assuming result[0] is an instance of Session
  }
}
