//gpt 
//review
//used to ensure that the child widget can be dragged independently and resized
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { updateWidgetPosition, updateWidgetStyles } from 'helpers/helpers';  // Import your new helpers
import { EditorState } from 'state/editor/EditorReducer';

interface DraggableWidgetProps {
  id: number;
  initialStyles: React.CSSProperties;
  editor: EditorState;
  section: string;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({ id, initialStyles, editor, section, children }) => {
  const [widgetStyles, setWidgetStyles] = useState(initialStyles);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { id },
    end: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const newPosition = { x: offset.x, y: offset.y };
        updateWidgetPosition(id, editor, newPosition, section);  // Update the widget's position when dropped
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleStyleUpdate = (newStyles: React.CSSProperties) => {
    const updatedStyles = updateWidgetStyles(id, editor, newStyles, section);  // Update widget styles
    setWidgetStyles(updatedStyles);  // Apply new styles locally in the component state
  };

  return (
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
  );
};

export default DraggableWidget;

