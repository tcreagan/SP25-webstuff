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
  ADD_ELEMENT = "ADD_ELEMENT",
  UNDO = "UNDO",
  REDO = "REDO",
  SAVE = "SAVE",
  LOAD = "LOAD",

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
  | { type: ActionType.LOAD_STATE; payload: EditorState }
  | { type: ActionType.ADD_ELEMENT; elementId: string}
  | { type: ActionType.UNDO }
  | { type: ActionType.REDO }
  | { type: ActionType.SAVE }
  | { type: ActionType.LOAD };


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
  history: EditorState[];
  historyIndex: number;
};

export type DropTargetData = {
  section: "header" | "body" | "footer";
  dropPositionId: number;
};

// #endregion

// Helper function to create a deep clone of the state
const createCleanState = (state: EditorState): EditorState => {
  const cleanState = {
    isDragging: state.isDragging,
    isEditing: state.isEditing,
    draggedItemId: state.draggedItemId,
    hoveredItemId: state.hoveredItemId,
    selectedElementId: state.selectedElementId,
    cursorPosition: state.cursorPosition ? { ...state.cursorPosition } : null,
    widgets: state.widgets.map(widget => ({ ...widget })),
    header: JSON.parse(JSON.stringify(state.header)),
    body: JSON.parse(JSON.stringify(state.body)),
    footer: JSON.parse(JSON.stringify(state.footer)),
    history: state.history,
    historyIndex: state.historyIndex
  };
  return cleanState;
};

// Helper function to compare states without using JSON.stringify
const areStatesEqual = (state1: EditorState, state2: EditorState): boolean => {
  // Compare primitive values first
  if (state1.isDragging !== state2.isDragging ||
      state1.isEditing !== state2.isEditing ||
      state1.draggedItemId !== state2.draggedItemId ||
      state1.hoveredItemId !== state2.hoveredItemId ||
      state1.selectedElementId !== state2.selectedElementId ||
      state1.historyIndex !== state2.historyIndex) {
    return false;
  }

  // Compare cursor position
  if (state1.cursorPosition && state2.cursorPosition) {
    if (state1.cursorPosition.row !== state2.cursorPosition.row ||
        state1.cursorPosition.col !== state2.cursorPosition.col) {
      return false;
    }
  } else if (state1.cursorPosition || state2.cursorPosition) {
    return false;
  }

  // Compare sections
  const compareSection = (section1: HtmlObject, section2: HtmlObject): boolean => {
    if (section1.html.nodes.length !== section2.html.nodes.length) {
      return false;
    }
    return section1.html.nodes.every((node, index) => {
      const otherNode = section2.html.nodes[index];
      if (node.element !== otherNode.element) return false;
      
      // Compare attributes
      const attrKeys1 = Object.keys(node.attributes);
      const attrKeys2 = Object.keys(otherNode.attributes);
      if (attrKeys1.length !== attrKeys2.length) return false;
      
      return attrKeys1.every(key => {
        const attr1 = node.attributes[key];
        const attr2 = otherNode.attributes[key];
        return attr1.value === attr2.value;
      });
    });
  };

  return compareSection(state1.header, state2.header) &&
         compareSection(state1.body, state2.body) &&
         compareSection(state1.footer, state2.footer);
};

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

  const handleAddAction = [
    ActionType.ADD_ELEMENT
  ]

  const UndoRedoActions = [
    ActionType.UNDO,
    ActionType.REDO
  ]

  // Handle undo/redo actions
  if (UndoRedoActions.includes(action.type)) {
    // Create a clean copy of the current history
    const cleanHistory = state.history.map(historyState => createCleanState(historyState));
    
    if (action.type === ActionType.UNDO && state.historyIndex > 0) {
      const previousState = cleanHistory[state.historyIndex - 1];
      return {
        ...previousState,
        history: cleanHistory,
        historyIndex: state.historyIndex - 1
      };
    }
    if (action.type === ActionType.REDO && state.historyIndex < cleanHistory.length - 1) {
      const nextState = cleanHistory[state.historyIndex + 1];
      return {
        ...nextState,
        history: cleanHistory,
        historyIndex: state.historyIndex + 1
      };
    }
    return state;
  }

  // For all other actions, create a new history entry
  const newState = (() => {
    if(MouseMovementActions.includes(action.type)){
      return handleMouseMovementAction(state, action)
    } else if(DragAndDropActions.includes(action.type)){
      return handleDragAndDropAction(state, action)
    } else if(DataFetchingActions.includes(action.type)){
      return handleDataFetchingAction(state, action)
    } else if(FocusedElementActions.includes(action.type)){
      return handleFocusedElementAction(state, action)
    } else if(DeleteElementActions.includes(action.type)){
      return handleDeleteAction(state, action)
    } else if(CopyElementActions.includes(action.type)){
      return handleCopyAction(state, action)
    } else if(LoadStateActions.includes(action.type)){
      return handleLoadStateAction(state, action)
    } else if(action.type === ActionType.ATTRIBUTE_CHANGED){
      if(!state.selectedElementId){
        return state;
      }

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
          sanitizedValue = action.newValue;
      }
    
      if(attr){
        attr.value = sanitizedValue;
      }

      return {...state}
    }
    return state;
  })();

  // Only add to history if the state has actually changed
  if (!areStatesEqual(newState, state)) {
    // Create a clean copy of the current history
    const cleanHistory = state.history.slice(0, state.historyIndex + 1).map(historyState => createCleanState(historyState));
    
    // Create a clean version of the new state
    const cleanNewState = createCleanState(newState);
    
    // Add the clean state to history
    cleanHistory.push(cleanNewState);
    
    // Limit history size to prevent memory issues
    const maxHistorySize = 50;
    if (cleanHistory.length > maxHistorySize) {
      cleanHistory.shift();
    }
    
    return {
      ...cleanNewState,
      history: cleanHistory,
      historyIndex: cleanHistory.length - 1
    };
  }

  return newState;
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
