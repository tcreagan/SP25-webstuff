/**
 * Represents a widget object from the database
 * 
 * Created By: Chris Morgan
 */

import { Column, Model, Required } from "./Model";

export class Widget extends Model{
  @Column
  @Required
  content?:string
}