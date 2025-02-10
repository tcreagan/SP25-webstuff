import React from 'react';
import { ResizableBox } from 'react-resizable';

interface CardWidgetProps {
  title: string;
  initialWidth: number;
  initialHeight: number;
}

const CardWidget: React.FC<CardWidgetProps> = ({ title, initialWidth, initialHeight, children }) => {
  return (
    <ResizableBox
      width={initialWidth}
      height={initialHeight}
      resizeHandles={['se']}
      minConstraints={[200, 150]}  // Minimum width and height
    >
      <div className="card" style={{ width: '100%', height: '100%', border: '1px solid #007bff', borderRadius: '8px', padding: '15px' }}>
        <h3>{title}</h3>
        {children}
      </div>
    </ResizableBox>
  );
};

export default CardWidget;
