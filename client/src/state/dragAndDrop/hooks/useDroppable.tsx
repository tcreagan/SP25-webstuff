import { useEffect, useRef } from 'react';
import { ActionType, useDragAndDropContext } from '../DragAndDropReducer';

/**
 * Set component to be a droppable container
 * @param onDrop Callback to handle the given payload when dropped on this component
 * @param onDragOver optional callback to occur when element is dragged over
 * @param onDragOut optional callback to occur when element is dragged out of
 * @returns 
 */
export const useDroppable = (onDrop: (payload:any) => void, onDragOver?: (payload:any) => void, onDragOut?: (payload:any) => void) => {
  const { dragState, dispatch } = useDragAndDropContext();
  // Reference to the HTML Element used as the drop target
  const dropRef = useRef<HTMLDivElement | null>(null);

  // Callback to be used when dropping has occured
  const handleDrop = () => {
    const payload = dragState.dragPayload;

    if(payload && dragState.canDrop){
      onDrop(payload)
    }

    dispatch({ type: ActionType.STOP_DRAG });
  };

  // Callback to be used when the element has been dragged over
  const handleDragOver = () => {
    const payload = dragState.dragPayload;

    if(dropRef.current && payload){
      dispatch({type: ActionType.DRAG_OVER, targetId: dropRef.current.id})
    }
    
    if(payload){
      onDragOver?.(payload)
    }
  };

  // Callback to be used when the element has been dragged out of
  const handleDragOut = () => {
    const payload = dragState.dragPayload;

    if(payload){
      onDragOut?.(payload)
    }
  }

  return { dropRef, handleDrop, handleDragOver, handleDragOut };
};

