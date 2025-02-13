import React from 'react';
import { ResizableBox } from 'react-resizable';

interface ResizableContainerProps {
  initialWidth: number;
  initialHeight: number;
  children?: React.ReactNode;
}

const ResizableContainer: React.FC<ResizableContainerProps> = ({ initialWidth, initialHeight, children }) => {
  return (
    <ResizableBox
      width={initialWidth}
      height={initialHeight}
      resizeHandles={['se']}
      minConstraints={[200, 200]}
      maxConstraints={[800, 600]}
    >
      <div style={{ width: '100%', height: '100%', border: '1px solid #ccc', padding: '10px' }}>
        {children}  {/* Render the child widgets inside the container */}
      </div>
    </ResizableBox>
  );
};

export default ResizableContainer;
