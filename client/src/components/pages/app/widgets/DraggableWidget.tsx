//gpt 
//review
//used to ensure that the child widget can be dragged independently and resized
import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableWidgetProps {
  id: string;
  initialStyles: React.CSSProperties;
  onUpdateStyle: (id: string, styles: React.CSSProperties) => void;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({ id, initialStyles, onUpdateStyle, children }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',
    item: { id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleStyleUpdate = (newStyles: React.CSSProperties) => {
    onUpdateStyle(id, newStyles);
  };

  return (
    <div
      ref={drag}
      className="draggable-widget"
      style={{
        ...initialStyles,  // Child widget manages its own styles
        opacity: isDragging ? 0.5 : 1,  // Indicate when dragging
        position: 'absolute',  // Ensure child widget can be positioned independently
      }}
    >
      {children}
    </div>
  );
};

export default DraggableWidget;
