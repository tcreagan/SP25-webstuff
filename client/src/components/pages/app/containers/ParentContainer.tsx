//gpt
//review
//ensures that styles and positioning only applies to self
import React from 'react';
import { DraggableWidget } from 'components/pages/app/widgets/DraggableWidget';

interface ParentContainerProps {
  children?: React.ReactNode
}

const ParentContainer: React.FC<ParentContainerProps> = ({ children }) => {
  return (
    <div
      className="parent-container"
      style={{
        display: 'flex',  // Container uses flexbox layout
        flexDirection: 'column',
        padding: '10px',  // Parent-specific padding
      }}
    >
      {children}
    </div>
  );
};

export default ParentContainer;
