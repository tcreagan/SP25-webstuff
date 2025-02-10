//gpt 
//review
//used to combine all the layouts together
import React from 'react';
import ResizableContainer from './ResizableContainer';
import CardWidget from './CardWidget';
import LayeredWidget from './LayeredWidget';
import DraggableTextBlock from './DraggableTextBlock';
import DraggableImageWidget from './DraggableImageWidget';

const MultiLayoutEditor: React.FC = () => {
  return (
    <div className="editor" style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Container-Based Layout */}
      <ResizableContainer initialWidth={500} initialHeight={300}>
        <DraggableTextBlock id="text1" initialText="Text Block in Container" />
        <DraggableImageWidget id="image1" initialUrl="https://example.com/image.jpg" />
      </ResizableContainer>

      {/* Card-Based Layout */}
      <CardWidget title="Card Widget" initialWidth={400} initialHeight={250}>
        <DraggableTextBlock id="text2" initialText="Text Block in Card" />
      </CardWidget>

      {/* Layered Layout */}
      <LayeredWidget id="layer1" initialContent="Layer 1 Widget" />
      <LayeredWidget id="layer2" initialContent="Layer 2 Widget" />
    </div>
  );
};

export default MultiLayoutEditor;
