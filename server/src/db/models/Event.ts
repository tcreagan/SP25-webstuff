/**
 * Represents an event object from the database
 * 
 * Created By: Chris Morgan
 */
import { EventType } from "../../internal";
import { BelongsTo, Column, Model, Required } from "./Model";

export class Event extends Model{
  @Column
  occurred_time?: Date

  @Column
  event_log?: string

  @Column
  @Required
  event_type_id?: number = undefined

  @Column
  user_id?: number

  @BelongsTo(() => EventType, "event_type_id")
  type?:EventType
}