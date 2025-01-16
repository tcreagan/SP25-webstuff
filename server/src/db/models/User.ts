/**
 * Represents a user object from the database
 * 
 * Created By: Chris Morgan
 */

import { Column, HasMany, Model, Required } from "./Model"
import { Project } from "./Project"

export class User extends Model{
  @Column
  @Required
  email?:string

  @Column
  @Required
  password_hash?:string

  @HasMany(()=>Project, "owner_id")
  projects?:Project[]
}