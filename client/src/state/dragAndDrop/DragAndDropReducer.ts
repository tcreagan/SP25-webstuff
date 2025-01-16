import { Key, useContext } from "react";
import { DragAndDropContext } from "./DragAndDropContext";

// #region type and constant definitions

// Define action types
export enum ActionType {
  START_DRAG = "START_DRAG",
  STOP_DRAG = "STOP_DRAG",
  DRAG_OVER = "DRAG_OVER",
  DRAG_OUT = "DRAG_OUT"
}

// Define action objects
export type DragAndDropActions =
  | { type: ActionType.START_DRAG; payload: any }
  | { type: ActionType.STOP_DRAG; }
  | { type: ActionType.DRAG_OVER; targetId: string}
  | { type: ActionType.DRAG_OUT; targetId: string}

export type DragAndDropState = {
  isDragging: boolean;
  canDrop: boolean;
  dragPayload: any | null;
  draggedItemId: string | null;
  hoveredItemId: string | null;
};

// #endregion

// Define a reducer to manage the state of drag and drop
export function dragAndDropReducer(state: DragAndDropState, action: DragAndDropActions): DragAndDropState {
    switch (action.type) {
      case ActionType.START_DRAG:
        // Set state to dragging and assign given payload
        return {
          ...state,
          isDragging: true,
          dragPayload: action.payload,
        };
      case ActionType.STOP_DRAG:
        // Set state to not dragging and reset payload
        return {
          ...state,
          isDragging: false,
          dragPayload: null,
        };
      case ActionType.DRAG_OVER:
        // Set state as able to drop
        return {
          ...state,
          hoveredItemId: action.targetId,
          canDrop: true
        };
      case ActionType.DRAG_OUT:
        // Set state as unable to drop
        return {
          ...state,
          hoveredItemId: null,
          canDrop: false
        }
      default:
        return state;
    }
}

export function useDragAndDropContext() {
  const context = useContext(DragAndDropContext);

  if (context) {
    return context;
  } else {
    throw new Error("useDragAndDropContext must be used inside of a DragAndDropProvider!");
  }
}