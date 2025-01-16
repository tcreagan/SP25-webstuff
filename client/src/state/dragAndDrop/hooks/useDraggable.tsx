import { useRef } from 'react';
import { ActionType, useDragAndDropContext } from '../DragAndDropReducer';

/**
 * Set component to be draggable
 * @param payload Object passed to target dropped element
 * @param onDragStart optional callback called on drag start
 * @returns 
 */
export const useDraggable = (payload: any, onDragStart?: () => void) => {
  const { dispatch } = useDragAndDropContext();
  // Reference object for access to target HTML element
  const dragRef = useRef<HTMLDivElement | null>(null);

  // Function to be used as a callback whenever dragging is to occur
  const startDrag = () => {
    dispatch({ type: ActionType.START_DRAG, payload: payload });
    onDragStart?.();
  };

  return { dragRef, startDrag };
};
