// Editor.tsx
import React, { useState, useRef, useEffect } from "react";
import { Header } from "./Header";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { useEditor } from "state/editor/EditorReducer";
import { useMouse } from "state/mouse/MouseReducer";
import { useDragAndDropContext } from "state/dragAndDrop/DragAndDropReducer";
import { ActionType } from "state/editor/EditorReducer";
import Sidebar from "components/Sidebar/Sidebar";
import "styles/Editor.scss";

export const Editor = () => {
  const { state: editor, dispatch: editorDispatch } = useEditor();
  const { state: mouseState } = useMouse();
  const { dragState } = useDragAndDropContext();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if the target is an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Undo: Ctrl/Cmd + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        editorDispatch({ type: ActionType.UNDO });
      }
      
      // Redo: Ctrl/Cmd + Shift + Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        editorDispatch({ type: ActionType.REDO });
      }

      // Redo: Ctrl/Cmd + Y
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        editorDispatch({ type: ActionType.REDO });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorDispatch]);

  // Pass widget behavior (resizing, snapping, z-index) to child components
  return (
    <div className="editor-page">
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
    </div>
  );
};

export default Editor;
