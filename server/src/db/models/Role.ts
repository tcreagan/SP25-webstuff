/**
 * Represents a role object from the database
 * 
 * Created By: Chris Morgan
 */

import { BelongsTo, Column, Model, Required } from "./Model"
import { Project } from "./Project"

export class Role extends Model{
  @Column
  @Required
  project_id?:number

  @Column
  @Required
  name?:string

  @BelongsTo(() => Project, "project_id")
  project?:Project
}