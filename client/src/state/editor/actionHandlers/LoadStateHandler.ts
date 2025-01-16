import { ActionType, EditorAction, EditorState } from "../EditorReducer";
 
// Responds to load state action events, replacing the current state with the loaded state.
export function handleLoadStateAction(state: EditorState, action: EditorAction): EditorState {
    // Only proceed if the action is specifically a load state action.
    if (action.type !== ActionType.LOAD_STATE) {
      return state; // No state change if action type is different.
    }

    const newState = {...state}
    newState.header = action.payload.header;
    newState.body = action.payload.body;
    newState.footer = action.payload.footer;
  
  
    return newState;
  }
  