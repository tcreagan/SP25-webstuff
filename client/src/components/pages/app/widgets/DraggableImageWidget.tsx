import React from 'react';
import { useDrag } from 'react-dnd';
import ImageWidget from './imageWidget';

interface DraggableImageWidgetProps {
  id: string;
  initialUrl: string;
  initialAlt: string;
  initialStyles: React.CSSProperties;
  onSave: (data: { url: string, alt: string, styles: React.CSSProperties }) => void;
}

const DraggableImageWidget: React.FC<DraggableImageWidgetProps> = (props) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'widget',   // Define a unique type for the drag item
    item: { id: props.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <ImageWidget
        initialUrl={props.initialUrl}
        initialAlt={props.initialAlt}
        initialStyles={props.initialStyles}
        onSave={props.onSave}
      />
    </div>
  );
};

export default DraggableImageWidget;
