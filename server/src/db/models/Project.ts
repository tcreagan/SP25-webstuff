/**
 * Represents a project object from the database
 * 
 * Created By: Chris Morgan
 */

import { BelongsTo, Column, HasMany, Model, Required } from "./Model"
import { ProjectPermission } from "./ProjectPermission"
import { User } from "./User"

export class Project extends Model{
  @Column
  @Required
  owner_id?:number

  @Column
  @Required
  project_name?:string

  @BelongsTo(() => User, "owner_id")
  owner?:User

  @HasMany(() => ProjectPermission, "project_id")
  permissions?:ProjectPermission
}