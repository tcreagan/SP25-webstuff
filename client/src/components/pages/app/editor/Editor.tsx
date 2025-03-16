// Editor.tsx
import React, { useState, useRef } from "react";
import { Header } from "./Header";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { useEditor } from "state/editor/EditorReducer";
import { useMouse } from "state/mouse/MouseReducer";
import { useDragAndDropContext } from "state/dragAndDrop/DragAndDropReducer";

export const Editor = () => {
  const { state: editor, dispatch: editorDispatch } = useEditor();
  const { state: mouseState } = useMouse();
  const { dragState } = useDragAndDropContext();
  
  // z-index state and management
  const [zIndexes, setZIndexes] = useState<{ [key: string]: number }>({});
  const [maxZIndex, setMaxZIndex] = useState(1);

  // Function to bring a widget to the front
  const bringToFront = (id: string) => {
    setZIndexes((prevZIndexes) => ({
      ...prevZIndexes,
      [id]: maxZIndex + 1,  // Increment z-index
    }));
    setMaxZIndex(maxZIndex + 1);  // Update the maximum z-index
  };

  // Pass widget behavior (resizing, snapping, z-index) to child components
  return (
    <div id="editor-window" className="editor">
      <div className="editor-container">
        <div className="header-section">
          <Header
            content={editor.header}
            zIndexes={zIndexes}
            bringToFront={bringToFront}
            maxZIndex={maxZIndex}
          />
        </div>
        <div className="body-section">
          <Body
            content={editor.body}
            zIndexes={zIndexes}
            bringToFront={bringToFront}
            maxZIndex={maxZIndex}
          />
        </div>
        <div className="footer-section">
          <Footer
            content={editor.footer}
            zIndexes={zIndexes}
            bringToFront={bringToFront}
            maxZIndex={maxZIndex}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
