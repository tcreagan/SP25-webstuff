import { BelongsTo, Column, Model, Required } from "./Model"
import { User } from "./User"

export class PageLayout extends Model{
  
  @Column
  @Required
  content?:string

  @Column
  user_id?:number

  @BelongsTo(() => User, "user_id")
  owner?:User
}