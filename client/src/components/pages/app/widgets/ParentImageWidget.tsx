import React from 'react';
import ImageWidget from './ImageWidget';

const Editor: React.FC = () => {
  // Save image data to the server or local storage
  const handleSave = (data: { url: string, alt: string, styles: React.CSSProperties }) => {
    console.log('Image Data:', data);
    // Persist the widget data (e.g., send to backend or store in local storage)
  };

  return (
    <div className="editor">
      <h2>Web Editor</h2>
      <ImageWidget
        initialUrl="https://example.com/default-image.jpg"
        initialAlt="Default Image"
        initialStyles={{ width: '100%', height: 'auto', border: '1px solid #ccc' }}
        onSave={handleSave}
      />
    </div>
  );
};

export default Editor;
