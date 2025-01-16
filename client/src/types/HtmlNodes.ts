import { HTMLInputTypeAttribute } from "react"

export interface HtmlNode{
  element: string,
  style: {[key:string]:NodeAttribute},
  attributes: {[key:string]:NodeAttribute},
  
  metadata?:NodeMetadata
  events?:object
}

export interface NodeAttribute{
  value: string
  hidden?: boolean
  readonly?: boolean
  suppress?: boolean
  input?: AttributeInputMetadata
}

export interface AttributeInputMetadata{
  type: HTMLInputTypeAttribute
  displayName?: string
  tooltip?: string
  options?: Array<{value:string, text:string}>
}

export interface RenderableHtmlNode extends HtmlNode{
  id:string,
  children?:RenderableHtmlNode[],
}

export interface StorableHtmlNode extends HtmlNode{
  children?:number[],
}

export type NodeMetadata = {
  droppable?:boolean
  draggable?:boolean
  selectable?:boolean
  editable?:boolean
  textbox?:boolean
  preview?:boolean
  primary?:boolean
  childDirection?: "vertical" | "horizontal"
}