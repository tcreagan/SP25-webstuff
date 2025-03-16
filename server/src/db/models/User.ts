/**
 * Represents a user object from the database
 * 
 * Created By: Chris Morgan
 */

import { Column, HasMany, Model, Required } from "./Model"
import { Project } from "./Project"
import DBConnector from "../dbConnector"

export class User extends Model{
  @Column
  @Required
  email?:string

  // Define the findByEmail static method
  static async findByEmail(email: string) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const result = await DBConnector.runQuery(sql, [email]);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }
  
  //validates email
  // Override the validate() method from Model.ts for custom rules
  validate(): boolean {
    // Call the base validate method for required fields
    const isValid = super.validate();

    // Add custom validation (e.g., ensure email format)
    if (this.email && !this.email.includes('@')) {
      this.errors.email = ['Invalid email format'];
      return false;
    }

    return isValid;
  }

  @Column
  @Required
  password_hash?:string

  @HasMany(()=>Project, "owner_id")
  projects?:Project[]
}
