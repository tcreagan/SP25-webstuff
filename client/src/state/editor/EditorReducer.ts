
// #region reducer definition

import { Key, useContext } from "react";
import { EditorContext } from "state/editor/EditorContext";
import { StorableHtmlNode } from "types/HtmlNodes";
import { HtmlObject } from "types/HtmlObject";
import { handleMouseMovementAction } from "./actionHandlers/MouseMovementHandler";
import { handleDragAndDropAction } from "./actionHandlers/DragAndDropHandler";
import { handleDataFetchingAction } from "./actionHandlers/DataFetchingHandler";
import { handleFocusedElementAction } from "./actionHandlers/FocusedElementHandler";
import { handleDeleteAction } from "./actionHandlers/DeleteHandler";
import { MouseState } from "state/mouse/MouseReducer";
import { handleCopyAction } from "./actionHandlers/copyHandler";
import { handleLoadStateAction } from "./actionHandlers/LoadStateHandler";
import { DragAndDropState } from "state/dragAndDrop/DragAndDropReducer";
import { parseId } from "./Helpers";
import { findPrimaryNode, sanitizeClassName, sanitizeImageUrl, sanitizeWidthOrHeight } from "components/pages/app/Helpers";


// #region type and constant definitions

// Define action types
export enum ActionType {
  START_DRAG = "START_DRAG",
  DRAG_OVER = "DRAG_OVER",
  DRAG_OUT = "DRAG_OUT",
  DROP = "DROP",
  CANCEL_DRAG = "CANCEL_DRAG",
  DELETE_ELEMENT = "DELETE_ELEMENT",  
  COPY_ELEMENT = "COPY_ELEMENT",

  VIEW_CODE = "VIEW_CODE",
  LOAD_STATE = "LOAD_STATE",

  HOVER = "HOVER",
  UNHOVER = "UNHOVER",

  FETCHED_WIDGETS = "FETCHED_WIDGETS",
  
  ELEMENT_SELECTED = "ELEMENT_SELECTED",
  ELEMENT_DOUBLE_CLICKED = "ELEMENT_DOUBLE_CLICKED",
  ELEMENT_BLURRED = "ELEMENT_BLURRED",
  ELEMENT_UNSELECTED = "ELEMENT_UNSELECTED",

  ATTRIBUTE_CHANGED = "ATTRIBUTE_CHANGED"
}

export type EditorAction =
  | { type: ActionType.HOVER; mouseState:MouseState; dragState:DragAndDropState, payload: string }
  | { type: ActionType.UNHOVER; mouseState:MouseState; payload: string }
  | { type: ActionType.START_DRAG; payload: number | string; dragRootId?: string }
  | { type: ActionType.DRAG_OVER; targetId: string, payload:any, mouseState:MouseState }
  | { type: ActionType.DRAG_OUT; targetId: string}
  | { type: ActionType.DROP; mouseState:MouseState; payload: HtmlObject; targetId: string; }
  | { type: ActionType.ELEMENT_SELECTED; selectedId: string; }
  | { type: ActionType.ELEMENT_UNSELECTED; }
  | { type: ActionType.ELEMENT_DOUBLE_CLICKED; containerId:string, elementId:string }
  | { type: ActionType.ELEMENT_BLURRED; elementId:string }
  | { type: ActionType.CANCEL_DRAG }
  | { type: ActionType.FETCHED_WIDGETS; widgets: HtmlObject[] }
  | { type: ActionType.DELETE_ELEMENT; elementId: string }
  | { type: ActionType.COPY_ELEMENT; elementId: string }
  | { type: ActionType.VIEW_CODE; elementId: string }
  | { type: ActionType.ATTRIBUTE_CHANGED; target:"style"|"attributes"; attribute:string; newValue:string }
  | { type: ActionType.LOAD_STATE; payload: EditorState };


export type EditorState = {
  isDragging: boolean;
  isEditing: boolean;
  draggedItemId: number | string | null;
  hoveredItemId: string | null;
  selectedElementId: string | null;
  cursorPosition: {row:number, col:number} | null;
  widgets: HtmlObject[];
  header: HtmlObject;
  body: HtmlObject;
  footer: HtmlObject;
};

export type DropTargetData = {
  section: "header" | "body" | "footer";
  dropPositionId: number;
};

// #endregion

// Define a reducer to manage the state of the editor
export function editorReducer(state: EditorState, action: EditorAction): EditorState {

  // Group actions for action handler delegation //
  const MouseMovementActions = [
    ActionType.HOVER,
    ActionType.UNHOVER,
  ]

  const DragAndDropActions = [
    ActionType.START_DRAG,
    ActionType.DRAG_OVER,
    ActionType.DROP,
    ActionType.CANCEL_DRAG
  ]

  const DataFetchingActions = [
    ActionType.FETCHED_WIDGETS
  ]

  const FocusedElementActions = [
    ActionType.ELEMENT_SELECTED,
    ActionType.ELEMENT_UNSELECTED,
    ActionType.ELEMENT_DOUBLE_CLICKED,
    ActionType.ELEMENT_BLURRED
  ]

  
  const DeleteElementActions = [
    ActionType.DELETE_ELEMENT
  ]

  const CopyElementActions = [
    ActionType.COPY_ELEMENT
  ]

  const LoadStateActions = [
    ActionType.LOAD_STATE
  ]

  if(MouseMovementActions.includes(action.type)){
    return handleMouseMovementAction(state, action)
  } else
  {
    if(DragAndDropActions.includes(action.type)){
      return handleDragAndDropAction(state, action)
    } else
    if(DataFetchingActions.includes(action.type)){
      return handleDataFetchingAction(state, action)
    } else
    if(FocusedElementActions.includes(action.type)){
      return handleFocusedElementAction(state, action)
    } else
    if(DeleteElementActions.includes(action.type)){
      return handleDeleteAction(state, action)
    }
    if(CopyElementActions.includes(action.type)){
      return handleCopyAction(state, action)
    }
    if(LoadStateActions.includes(action.type)){
      return handleLoadStateAction(state, action)
    }
  }

  if(action.type === ActionType.ATTRIBUTE_CHANGED){
    if(!state.selectedElementId){
      return state;
    }

    console.log("attribute ", action.attribute)
    console.log('target id', state.selectedElementId)

    const {section, index} = parseId(state.selectedElementId)

    const primaryIndex = findPrimaryNode(index, state, section)

    const node = state[section].html.nodes[primaryIndex ?? index]

    const attr = node[action.target][action.attribute]
    
    let sanitizedValue;
    switch(action.attribute) {
      case 'className':
        sanitizedValue = sanitizeClassName(action.newValue, attr.value);
        break;
      case 'height':
      case 'width':
        sanitizedValue = sanitizeWidthOrHeight(action.newValue, attr.value);
        break;
      case 'src':
        sanitizedValue = sanitizeImageUrl(action.newValue, attr.value);
        break;
      default:
        sanitizedValue = action.newValue; // Default case if no specific sanitization is needed
    }
  
    if(attr){
      attr.value = sanitizedValue;
    }

    return {...state}
  }

  return state;
}

 
// #region Hooks

// export function useDrag() { }

// export function useDrop() { }

export function useEditor() {
  const context = useContext(EditorContext);

  if (context) {
    return context;
  } else {
    throw new Error("useEditor must be used inside of an EditorProvider!");
  }
}

// #endregion