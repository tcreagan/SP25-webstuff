import { useEditor, ActionType } from "state/editor/EditorReducer";
import UndoIcon from "../assets/images/undo-icon.svg";
import RedoIcon from "../assets/images/redo-icon.svg";

export const UndoRedoButtons = () => {
  const { state: editor, dispatch: editorDispatch } = useEditor();

  return (
    <div className="undo-redo-container">
      <button 
        className="toolbar-button"
        onClick={() => editorDispatch({ type: ActionType.UNDO })}
        disabled={editor.historyIndex <= 0}
        title="Undo (Ctrl+Z)"
      >
        <img src={UndoIcon} alt="Undo" />
      </button>
      <button 
        className="toolbar-button"
        onClick={() => editorDispatch({ type: ActionType.REDO })}
        disabled={editor.historyIndex >= editor.history.length - 1}
        title="Redo (Ctrl+Shift+Z)"
      >
        <img src={RedoIcon} alt="Redo" />
      </button>
    </div>
  );
}; 
