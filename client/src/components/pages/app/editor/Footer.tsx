import {HtmlObject} from "types/HtmlObject"
import {HtmlInterpreter} from "../HtmlInterpreter"

type Props = {
  content: HtmlObject;
};

interface DroppedItem {
  type: "WIDGET";
  content: HtmlObject;
}

export const Footer = (props: Props) => {
  // Get the nodes to render, either from preview or actual content
  const nodesToRender = props.content.metadata.preview?.obj?.html.nodes || props.content.html.nodes;

  return (
    <div className="editor-footer-container" >
      <HtmlInterpreter 
        prefix="f" 
        content={nodesToRender}
      />
    </div>
  )
};
