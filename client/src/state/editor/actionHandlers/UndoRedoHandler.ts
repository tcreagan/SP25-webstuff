import { ActionType, EditorAction, EditorState } from "../EditorReducer";

export function handleUndoRedoAction(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case ActionType.UNDO:
      if (state.historyIndex > 0) {
        const newIndex = state.historyIndex - 1;
        return {
          ...state.history[newIndex],
          history: state.history,
          historyIndex: newIndex
        };
      }
      return state;

    case ActionType.REDO:
      if (state.historyIndex < state.history.length - 1) {
        const newIndex = state.historyIndex + 1;
        return {
          ...state.history[newIndex],
          history: state.history,
          historyIndex: newIndex
        };
      }
      return state;

    default:
      return state;
  }
} 
