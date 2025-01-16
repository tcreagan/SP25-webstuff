import { Children, default as React, ReactHTMLElement, cloneElement, useEffect, useRef, useState } from "react";
import { Header } from "./Header"
import { Body } from "./Body"
import { Footer } from "./Footer"
import { HtmlObject } from "types/HtmlObject"
import { useEditor } from "state/editor/EditorReducer";
import { StorableHtmlNode } from "types/HtmlNodes";
import { getDropChildId, insertDroppedElement, parseId } from "state/editor/Helpers";
import { useMouse } from "state/mouse/MouseReducer";
import { useDragAndDropContext } from "state/dragAndDrop/DragAndDropReducer";

type Props = {};

export function buildPreview(content:HtmlObject){

}

export const Editor = (props: Props) => {
  const { state: editor, dispatch: editorDispatch } = useEditor();
  const {state: mouseState} = useMouse();
  const {dragState} = useDragAndDropContext();

  let data = {
    header: editor.header,
    body: editor.body,
    footer: editor.footer
  }

  if(dragState.isDragging && editor.hoveredItemId && dragState.canDrop){
    const {section, index} = parseId(editor.hoveredItemId)

    const predictedIndex = getDropChildId(mouseState, editor, editor.hoveredItemId)


    const previewObject:HtmlObject = {
      metadata: {
        type: "WIDGET"
      },
      html: {
        nodes: [
        {
          element: "div",
          style: {},
          attributes: {
            "className": {value: "preview"}
          },
          metadata: {
            preview: true
          }
          
        }
      ]
      }
    }

    data[section] = structuredClone(editor[section])

    data[section] = insertDroppedElement(predictedIndex, editor, previewObject, editor.hoveredItemId)[section]
  }
  return (
    <div id="editor-window" className="editor">
      <div className="editor-container">
        <div className="header-section">
          <div className="tab">Header</div>
          <Header content={data.header}
          /> 
        </div> 
        <div className="body-section">
          <div className="tab">Body</div>
          <Body content={data.body}
          /> 
        </div> 
        <div className="footer-section">
          <div className="tab">Footer</div>
          <Footer content={data.footer}
          /> 
        </div> 
      </div>
    </div>
  );
};
