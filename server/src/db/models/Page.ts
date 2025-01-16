import { BelongsTo, Column, Model, Required } from "./Model"
import { Project } from "./Project"

export class Page extends Model{
  @Column
  @Required
  project_id?:number

  @Column
  @Required
  content?:string

  @BelongsTo(() => Project, "project_id")
  project?:Project
}