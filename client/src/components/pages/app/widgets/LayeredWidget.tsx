//gpt 
//review
//used for layered layout for floating elements, popups, or overlapping designs
import React, { useState } from 'react';

interface LayeredWidgetProps {
  id: string;
  initialContent: string;
}

const LayeredWidget: React.FC<LayeredWidgetProps> = ({ id, initialContent }) => {
  const [zIndex, setZIndex] = useState(1); // Default z-index

  const bringForward = () => {
    setZIndex((prevZIndex) => prevZIndex + 1); // Increase z-index to bring the widget forward
  };

  const sendBackward = () => {
    setZIndex((prevZIndex) => (prevZIndex > 1 ? prevZIndex - 1 : prevZIndex)); // Decrease z-index to send the widget backward
  };

  return (
    <div
      className="layered-widget"
      style={{
        position: 'absolute',
        zIndex: zIndex,
        left: `${Math.random() * 400}px`, // Random position for example
        top: `${Math.random() * 400}px`,  // Random position for example
        padding: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        cursor: 'move',
      }}
    >
      <div>{initialContent}</div>
      <button onClick={bringForward}>Bring Forward</button>
      <button onClick={sendBackward}>Send Backward</button>
    </div>
  );
};

export default LayeredWidget;
