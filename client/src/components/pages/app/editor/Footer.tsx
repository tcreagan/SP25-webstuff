import {HtmlObject} from "types/HtmlObject"
import {HtmlInterpreter} from "../HtmlInterpreter"
import {buildPreview} from "./Editor"

type Props = {
  content: HtmlObject;
};

interface DroppedItem {
  type: "WIDGET";
  content: HtmlObject;
}

export const Footer = (props: Props) => {
  let content = [...props.content.html.nodes]
  if(props.content.metadata.preview){
    //content = buildPreview(props.content)
  }

  return (
    <div className="editor-footer-container" >
      <HtmlInterpreter prefix="f" content={props.content.html.nodes}/>
    </div>
  )
};
