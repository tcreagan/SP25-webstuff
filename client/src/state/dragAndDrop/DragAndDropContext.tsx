import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";
import React from "react";
import { ActionType, DragAndDropActions, DragAndDropState, dragAndDropReducer } from "./DragAndDropReducer";

export type DragAndDropContext = {
  dragState: DragAndDropState;
  dispatch: React.Dispatch<DragAndDropActions>;
} | null;

// Initialize drag and drop state
const initialEditorState: DragAndDropState = {
  isDragging: false,
  canDrop: false,
  dragPayload: null,
  draggedItemId: null,
  hoveredItemId: null,
};

export const DragAndDropContext = createContext<DragAndDropContext>(null);

export function DragAndDropProvider({ children }: { children: ReactNode }) {
  // Initialize reducer to manage drag and drop state
  const [dragState, dispatch] = useReducer(dragAndDropReducer, initialEditorState);

  // assign default event handler to always stop dragging when mouse is let go
  document.body.onmouseup = () => { dispatch({ type: ActionType.STOP_DRAG }) }

  useEffect(() => {
    // declare logic for setting cursor based on drag state
    const updateCursor = () => {
      if (dragState.isDragging) {
        if (dragState.canDrop) {
          document.body.style.cursor = "copy";
        } else {
          document.body.style.cursor = "not-allowed";
        }
      }
      else {
        document.body.style.cursor = "default";
      }
    };

    updateCursor();

    return () => {
      // Reset cursor when component unmounts
      document.body.style.cursor = "default";
    };
  }, [dragState.isDragging, dragState.canDrop]);

  return (
    <DragAndDropContext.Provider value={{ dragState: dragState, dispatch: dispatch }}>
      {children}
    </DragAndDropContext.Provider>
  );
}
