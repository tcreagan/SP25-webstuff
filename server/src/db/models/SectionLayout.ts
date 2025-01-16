/**
 * Represents a section layout object from the database
 * 
 * Created By: Chris Morgan
 */
import { Column, Model, BelongsTo, Required } from "./Model"
import { User } from "./User"

export class SectionLayout extends Model{
  
  @Column
  @Required
  content?:string

  @Column
  user_id?:number

  @BelongsTo(() => User, "user_id")
  owner?:User
}