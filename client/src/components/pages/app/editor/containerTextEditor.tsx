/*
import React from 'react';
import ResizableContainer from 'components/pages/app/containers/ResizableContainer';
import DraggableTextBlock from 'components/pages/app/TextBox'; // need to create import,testing
import DraggableImageWidget from 'components/pages/app/widgets/DraggableImageWidget';

const ContainerEditor: React.FC = () => {
  return (
    <div className="editor">
      {/* Container 1 *}
      <ResizableContainer initialWidth={400} initialHeight={300}>
        <DraggableTextBlock id="text1" initialText="Text Block 1" />
        <DraggableImageWidget id="image1" initialUrl="https://example.com/image.jpg" intialAlt="None" initialStyles={none} onSave="data"/>
      </ResizableContainer>

      {/* Container 2 *}
      <ResizableContainer initialWidth={600} initialHeight={400}>
        <DraggableTextBlock id="text2" initialText="Text Block 2" />
        <DraggableImageWidget id="image2" initialUrl="https://example.com/image2.jpg" intialAlt="None" initialStyles={none} onSave="data"/>
      </ResizableContainer>
    </div>
  );
};

export default ContainerEditor;
