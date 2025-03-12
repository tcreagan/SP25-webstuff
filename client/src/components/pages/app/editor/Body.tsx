import {HtmlInterpreter} from "../HtmlInterpreter"
import {HtmlObject} from "types/HtmlObject"

type Props = {
  content: HtmlObject;
};

export const Body = (props: Props) => {
  // Get the nodes to render, either from preview or actual content
  const nodesToRender = props.content.metadata.preview?.obj?.html.nodes || props.content.html.nodes;

  return (
    <div className="editor-body-container">
      <HtmlInterpreter 
        prefix="b" 
        content={nodesToRender}
      />
    </div>
  )
};
