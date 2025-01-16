import { StorableHtmlNode } from "./HtmlNodes"

export type HtmlObject = {
    metadata: 
    {
      type: "WIDGET" | "TEMPLATE" | "PAGE" | "PAGE_SECTION",
      name?:string,
      icon?: string
      tooltip?:string,
      preview?:{obj: HtmlObject, parentId:number, targetId:number}
    }
  html:{
    nodes:StorableHtmlNode[]
  }
}