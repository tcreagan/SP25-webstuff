import {HtmlObject} from "types/HtmlObject"
import {HtmlInterpreter} from "../HtmlInterpreter"

type Props = {
  content: HtmlObject;
};

export const Header = (props: Props) => {
  // Get the nodes to render, either from preview or actual content
  const nodesToRender = props.content.metadata.preview?.obj?.html.nodes || props.content.html.nodes;

  return (
    <div className="editor-header-container" >
      <HtmlInterpreter 
        prefix="h" 
        content={nodesToRender}
      />
    </div>
  )
};
