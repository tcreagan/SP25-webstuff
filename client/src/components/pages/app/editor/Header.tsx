import {HtmlObject} from "types/HtmlObject"
import {HtmlInterpreter} from "../HtmlInterpreter"
import { useEditor } from "state/editor/EditorReducer";

type Props = {
  content: HtmlObject;
};

export const Header = (props: Props) => {
  const { state: editor } = useEditor();
  let content = [...props.content.html.nodes]
  if(props.content.metadata.preview){
  //  content = buildPreview(props.content)
  }
  
  return (
    <div className="editor-header-container">
      <div className="editor-toolbar">
      </div>
      <HtmlInterpreter prefix="h" content={props.content.html.nodes}/>
    </div>
  )
};
