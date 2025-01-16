import {HtmlObject} from "types/HtmlObject"
import {HtmlInterpreter} from "../HtmlInterpreter"
import {buildPreview} from "./Editor"

type Props = {
  content: HtmlObject;

};

export const Header = (props: Props) => {
  let content = [...props.content.html.nodes]
  if(props.content.metadata.preview){
  //  content = buildPreview(props.content)
  }
  
  return (
    <div className="editor-header-container" >
      <HtmlInterpreter prefix="h" content={props.content.html.nodes}/>
    </div>
  )
};
