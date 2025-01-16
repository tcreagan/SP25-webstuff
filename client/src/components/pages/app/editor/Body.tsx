import {HtmlInterpreter} from "../HtmlInterpreter"
import {HtmlObject} from "types/HtmlObject"
import {Editor, buildPreview} from "./Editor"
//import { buildQueries } from "@testing-library/react";

type Props = {
  content: HtmlObject;
};

export const Body = (props: Props) => {
  let content = [...props.content.html.nodes]
  if(props.content.metadata.preview){
    //content = buildPreview(props.content)
  }
  return (
    <div className="editor-body-container">
      <HtmlInterpreter prefix="b" content={props.content.html.nodes}/>
    </div>
  )

 
};
