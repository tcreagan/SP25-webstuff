import { HtmlObject } from "types/HtmlObject";
import { ActionType, EditorAction, EditorState } from "../EditorReducer";
import { StorableHtmlNode } from "types/HtmlNodes";
import { sectionFromId, getDropChildId, parseId, storableNodeToHtmlObject } from "../Helpers";

export function handleMouseMovementAction(state: EditorState, action: EditorAction):EditorState{
  let target: HTMLElement | null;
  let dragged: HtmlObject
  let id: string;
  let prefix: string;
  let section: "header" | "body" | "footer";

  switch(action.type){

        case ActionType.HOVER:{
          if(action.dragState.isDragging) return state

          if (state.hoveredItemId) {
            target = document.getElementById(state.hoveredItemId);
    
            if (target) {
              target.classList.remove("hovered");
            }
          }
          target = document.getElementById(action.payload);
    
          // give hovered element the 'hovered' class for styling
          if (target) {
            target.classList.add("hovered");
          }

          // track hovered id in state
          return { ...state, hoveredItemId: action.payload };
    }
        case ActionType.UNHOVER:{
          target = document.getElementById(action.payload);
    
          prefix = action.payload!.split("-")[0];
          id = action.payload.split("-")[1];
          section = prefix === "h" ? "header" : prefix === "b" ? "body" : "footer";
    
          state[section].metadata.preview = undefined;
    
          // remove 'hovered' class from unhovered element
          if (target) {
            target.classList.remove("hovered");
          }
    
          // Consider setting hoveredItemId in state to null?
          return { ...state, hoveredItemId: null };
        }
        default:
          return state

  }
}