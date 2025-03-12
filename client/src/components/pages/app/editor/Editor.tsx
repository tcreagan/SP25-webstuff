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
import { ActionType } from "state/editor/EditorReducer";

type Props = {};

// Helper function to ensure dropped elements have proper metadata and style
const prepareDroppedElement = (element: HtmlObject): HtmlObject => {
  // Create a deep clone to avoid modifying the original
  const processedElement = structuredClone(element);
  
  // Ensure the root element has the required metadata
  processedElement.metadata = {
    ...processedElement.metadata,
    type: "WIDGET",
    preview: undefined // Clear any preview data
  };

  // Process each node in the widget to add draggable/droppable capabilities
  // but preserve their original structure and properties
  processedElement.html.nodes = processedElement.html.nodes.map(node => ({
    ...node,
    metadata: {
      ...node.metadata,
      draggable: true,
      droppable: true
    },
    // Preserve all other properties
    element: node.element,
    attributes: node.attributes,
    style: node.style,
    children: node.children || []
  }));

  return processedElement;
};

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
    const {section, index} = parseId(editor.hoveredItemId);
    const predictedIndex = getDropChildId(mouseState, editor, editor.hoveredItemId);

    // Create preview with proper sizing metadata
    const previewObject: HtmlObject = {
      metadata: {
        type: "WIDGET",
        preview: {
          obj: dragState.dragPayload,
          parentId: index,
          targetId: predictedIndex
        }
      },
      html: {
        nodes: [{
          element: "div",
          style: {
            width: { value: '200px' },
            height: { value: '100px' },
            position: { value: 'relative' },
            border: { value: '2px dashed #4a90e2' },
            backgroundColor: { value: 'rgba(74, 144, 226, 0.1)' },
            boxShadow: { value: '0 0 10px rgba(74, 144, 226, 0.2)' },
            margin: { value: '4px' },
            padding: { value: '8px' }
          },
          attributes: {
            "className": {value: "preview-container"}
          },
          metadata: {
            preview: true,
            draggable: true,
            droppable: true
          },
          children: []
        }]
      }
    };

    data[section] = structuredClone(editor[section]);
    data[section] = insertDroppedElement(predictedIndex, editor, previewObject, editor.hoveredItemId)[section];
  }

  return (
    <div id="editor-window" className="editor">
      <div className="editor-container">
        <div 
          className="header-section" 
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (dragState.isDragging) {
              editorDispatch({
                type: ActionType.DRAG_OVER,
                targetId: "h-0",
                payload: dragState.dragPayload,
                mouseState: mouseState
              });
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragState.isDragging && dragState.dragPayload) {
              const droppedWidget = prepareDroppedElement(dragState.dragPayload);
              editorDispatch({
                type: ActionType.DROP,
                mouseState: mouseState,
                payload: droppedWidget,
                targetId: "h-0"
              });
            }
          }}
        >
          <div className="tab">Header</div>
          <Header content={data.header} /> 
        </div> 
        <div 
          className="body-section"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (dragState.isDragging) {
              editorDispatch({
                type: ActionType.DRAG_OVER,
                targetId: "b-0",
                payload: dragState.dragPayload,
                mouseState: mouseState
              });
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragState.isDragging && dragState.dragPayload) {
              const droppedWidget = prepareDroppedElement(dragState.dragPayload);
              editorDispatch({
                type: ActionType.DROP,
                mouseState: mouseState,
                payload: droppedWidget,
                targetId: "b-0"
              });
            }
          }}
        >
          <div className="tab">Body</div>
          <div className="body-content">
            <Body content={data.body} />
          </div>
        </div> 
        <div 
          className="footer-section"
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (dragState.isDragging) {
              editorDispatch({
                type: ActionType.DRAG_OVER,
                targetId: "f-0",
                payload: dragState.dragPayload,
                mouseState: mouseState
              });
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragState.isDragging && dragState.dragPayload) {
              const droppedWidget = prepareDroppedElement(dragState.dragPayload);
              editorDispatch({
                type: ActionType.DROP,
                mouseState: mouseState,
                payload: droppedWidget,
                targetId: "f-0"
              });
            }
          }}
        >
          <div className="tab">Footer</div>
          <Footer content={data.footer} /> 
        </div> 
      </div>
    </div>
  );
};
