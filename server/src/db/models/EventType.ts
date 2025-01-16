/**
 * Represents and event type stored in the database
 * 
 * Created by: Chris Morgan
 */
import { Column, HasMany, Model, Required } from "./Model"
import {Event} from "../../internal"

export class EventType extends Model{
  @Column
  @Required
  name?:string

  @HasMany(() => Event, "event_type_id")
  events?:Event[]
}
