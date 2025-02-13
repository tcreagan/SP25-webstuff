//gpt 
//review
//used to ensure that the child widget can be dragged independently and resized
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { updateWidgetPosition, updateWidgetStyle } from 'components/pages/app/Helpers';  // Import your new helpers
import { EditorState } from 'state/editor/EditorReducer';
import { snapToGrid } from 'components/pages/app/utils/snapToGrid';  // Import your snapToGrid helper
import ResizableContainer from 'components/pages/app/containers/ResizableContainer';

interface DraggableWidgetProps {
  id: number;
  initialStyles: React.CSSProperties;
  editor: EditorState;
  section: string;
  children?: React.ReactNode;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({ id, initialStyles, editor, section, children }) => {
  const [widgetStyles, setWidgetStyles] = useState(initialStyles);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { id },
    end: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        //gpt
        //review
        // Snap the widget to the grid before updating the position
        const [snappedX, snappedY] = snapToGrid(offset.x, offset.y);
        const newPosition = { x: snappedX, y: snappedY };
        updateWidgetPosition(id, newPosition.x, newPosition.y, section);  // Update the widget's position when dropped
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleStyleUpdate = (newStyles: React.CSSProperties) => {
    const updatedStyles = updateWidgetStyle(id, newStyles, section);  // Update widget styles
    setWidgetStyles(updatedStyles);  // Apply new styles locally in the component state
  };

  return (
    //gpt 
    //review
    //add resize handlers to update width and height
    <ResizableContainer
      //initialWidth={widgetStyles.width || 100} //figure out why width and height require strings
      height={widgetStyles.height || 100}
      //onResize={handleResize} //handleResize cannot be found
      resizeHandles={['se']}  // Enable resizing from bottom-right corner
    >
    <div
      ref={drag}
      className="draggable-widget"
      style={{
        ...widgetStyles,  // Apply current widget styles
        opacity: isDragging ? 0.5 : 1,  // Show reduced opacity while dragging
      }}
    >
      {children}
    </div>
    </ResizableContainer>
  );
}

export default DraggableWidget;

