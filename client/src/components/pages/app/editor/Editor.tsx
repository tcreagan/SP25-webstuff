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
  // Pass widget behavior (resizing, snapping, z-index) to child components
  return (
    <div id="editor-window" className="editor">
      <div className="editor-container">
        <div className="header-section">
          <Header
            content={editor.header}
          />
        </div>
        <div className="body-section">
          <Body
            content={editor.body}
          />
        </div>
        <div className="footer-section">
          <Footer
            content={editor.footer}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
