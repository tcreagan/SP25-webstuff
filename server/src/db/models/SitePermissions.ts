/**
 * Represents a site permission object from the database
 * 
 * Created By: Chris Morgan
 */

import { Column, Model, Required } from "./Model";

export class SitePermission extends Model{
  @Column
  @Required
  url_pattern?:string
}