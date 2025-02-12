import React from 'react';
import CardWidget from 'components/pages/app/widgets/CardWidget';
// import DraggableTextBlock from './DraggableTextBlock'; //DNE, need to create 
import DraggableImageWidget from 'components/pages/app/widgets/DraggableImageWidget';
import DraggableTextBlock from 'components/pages/app/Textbox';

const CardEditor: React.FC = () => {
  return (
    <div className="editor">
      {/* Card 1 */}
      <CardWidget title="Card 1" initialWidth={300} initialHeight={200} children>
        <DraggableTextBlock id="text1" initialText="Text Block in Card 1" />
      </CardWidget>

      {/* Card 2 */}
      <CardWidget title="Card 2" initialWidth={500} initialHeight={300}>
        <DraggableImageWidget id="image1" initialUrl="https://example.com/image.jpg" />
        <DraggableTextBlock id="text2" initialText="Text Block in Card 2" />
      </CardWidget>
    </div>
  );
};

export default CardEditor;
