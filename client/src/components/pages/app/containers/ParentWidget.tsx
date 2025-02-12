// gpt
//review
//container to ensure parent widgets dont override
import React from 'react';
import { DraggableWidget } from 'components/pages/app/widgets/DraggableWidget';

const ParentWidget: React.FC = () => {
  const handleStyleUpdate = (id: string, newStyles: React.CSSProperties) => {
    // Logic to update child widget styles
    console.log(`Widget ${id} updated with styles`, newStyles);
  };

  return (
    <div className="parent-widget" style={{ position: 'relative', padding: '20px' }}>
      <DraggableWidget id="widget1" initialStyles={{ top: '50px', left: '100px' }} onUpdateStyle={handleStyleUpdate}>
        <div className="child-widget-content">I am a child widget</div>
      </DraggableWidget>

      <DraggableWidget id="widget2" initialStyles={{ top: '150px', left: '200px' }} onUpdateStyle={handleStyleUpdate}>
        <div className="child-widget-content">I am another child widget</div>
      </DraggableWidget>
    </div>
  );
};

export default ParentWidget;
