import "styles/layout.css";
import { useSaveLoadActions } from "../../../state/editor/Helpers";
import { useState, useEffect } from "react";
import { useEditor } from "state/editor/EditorReducer";
import { ActionType } from "state/editor/EditorReducer";

const PageHeader = () => {
  const { saveToLocalStorage, loadFromLocalStorage } = useSaveLoadActions();
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const [saveMessage, setSaveMessage] = useState("Save");
  const [loadMessage, setLoadMessage] = useState("Load");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        editorDispatch({ type: ActionType.UNDO });
      }
      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        editorDispatch({ type: ActionType.REDO });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorDispatch]);

  const handleSaveClick = () => {
    saveToLocalStorage("editorState");
    setSaveMessage("Saved!");
    setTimeout(() => {
      setSaveMessage("Save");
    }, 2000); // Reset save message after 2 seconds
  };

  const handleLoadClick = () => {
    loadFromLocalStorage("editorState");
    setLoadMessage("Loaded!");
    setTimeout(() => setLoadMessage("Load"), 2000); // Reset load message after 2 seconds
  };

  const handleUndoClick = () => {
    editorDispatch({ type: ActionType.UNDO });
  };

  const handleRedoClick = () => {
    editorDispatch({ type: ActionType.REDO });
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="page-info">
          <div className="page-name-section">
            <label htmlFor="pageName" className="page-label">
              Page name:
            </label>
            <span id="pageName" className="page-name">
              About Me
            </span>
          </div>
          <div className="permalink-section">
            <span className="permalink-label">Permalink:</span>
            <span className="permalink">
              johndoe.com/<a href="johndoe.com/about-me">about-me</a>
            </span>
          </div>
        </div>
      </div>

      <div className="header-middle">
        <span className="current-page-name">Current Page</span>
        <select name="current-page" className="current-page-dropdown">
          <option value="about">About Me</option>
          <option value="contact">Contact</option>
          <option value="bio">Biography</option>
          <option value="testimonials">Testimonials</option>
        </select>
      </div>

      <div className="header-right">
        <button 
          className="undo-button" 
          onClick={handleUndoClick}
          disabled={editorState.historyIndex <= 0}
        >
          Undo
        </button>
        <button 
          className="redo-button" 
          onClick={handleRedoClick}
          disabled={editorState.historyIndex >= editorState.history.length - 1}
        >
          Redo
        </button>
        <button className="save-button" onClick={handleSaveClick}>
          {saveMessage}
        </button>
        <button className="load-button" onClick={handleLoadClick}>
          {loadMessage}
        </button>
      </div>
    </header>
  );
};

export default PageHeader;
