import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { snapToGrid } from '../utils/snapToGrid';
//import DraggableTextBlock from './DraggableTextBlock'; //figure out where this import is supposed to come from

interface WidgetPosition {
  id: string;
  left: number;
  top: number;
}

const Editor: React.FC = () => {
  const [widgets, setWidgets] = useState<WidgetPosition[]>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'widget',
    drop: (item: { id: string }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        const [left, top] = snapToGrid(offset.x, offset.y);
        const newWidget: WidgetPosition = {
          id: item.id,
          left,
          top,
        };
        setWidgets((prevWidgets) => [...prevWidgets, newWidget]);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div ref={drop} className="editor" style={{ width: '100%', height: '500px', position: 'relative', border: '1px solid black' }}>
      <h2>Drag Widgets into the Editor</h2>

      {widgets.map((widget) => (
        <div key={widget.id} style={{ position: 'absolute', left: widget.left, top: widget.top }}>
          <DraggableTextBlock
            id={widget.id}
            initialText="Editable Text Block"
            initialStyles={{ width: '200px', height: 'auto', border: '1px solid #ccc' }}
            onSave={(data: any) => console.log('Widget data saved:', data)} //figure out what type to assign to data, attempting to fix using any
          />
        </div>
      ))}
    </div>
  );
};

export default Editor;
