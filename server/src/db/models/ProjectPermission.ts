/**
 * Represents a project_permission object from the database
 * 
 * Created By: Chris Morgan
 */

import { BelongsTo, Column, Model, Required } from "./Model"
import { Project } from "./Project"

export class ProjectPermission extends Model{
  @Column
  @Required
  project_id?:number

  @Column
  @Required
  default_read_new?:boolean

  @Column
  @Required
  default_write_new?:boolean

  @Column
  @Required
  admin?:boolean


  @BelongsTo(() => Project, "project_id")
  project?:Project
}