//gpt 
//review
//for absolute positioning, can bring a widget forward and backward
import React from 'react';
import LayeredWidget from './LayeredWidget';

const LayeredEditor: React.FC = () => {
  return (
    <div className="editor" style={{ position: 'relative', width: '600px', height: '600px', border: '1px solid #000' }}>
      <LayeredWidget id="layer1" initialContent="Layer 1 Widget" />
      <LayeredWidget id="layer2" initialContent="Layer 2 Widget" />
      <LayeredWidget id="layer3" initialContent="Layer 3 Widget" />
    </div>
  );
};

export default LayeredEditor;
