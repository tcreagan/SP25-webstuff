import { ActionType, EditorAction, EditorState } from "../EditorReducer";

export function handleDataFetchingAction(state: EditorState, action: EditorAction):EditorState{

  switch(action.type){
    case ActionType.FETCHED_WIDGETS: 
      return {
        ...state,
        widgets: action.widgets,
      };

    default:
      return state;
  }
}