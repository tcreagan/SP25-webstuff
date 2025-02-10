//gpt generated 
//needs review
// image widget properties handles saves and edits
import React, { useState } from 'react';

// Props for the Image Widget
interface ImageWidgetProps {
  initialUrl?: string;
  initialAlt?: string;
  initialStyles?: React.CSSProperties;
  onSave: (data: { url: string, alt: string, styles: React.CSSProperties }) => void;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({ initialUrl = '', initialAlt = '', initialStyles = {}, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(initialUrl);        // Image URL
  const [alt, setAlt] = useState(initialAlt);        // Alt text
  const [styles, setStyles] = useState(initialStyles);  // Image styles

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  // Handle Alt text input change
  const handleAltChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAlt(event.target.value);
  };

  // Handle style changes
  const handleStyleChange = (event: React.ChangeEvent<HTMLInputElement>, styleKey: keyof React.CSSProperties) => {
    setStyles({
      ...styles,
      [styleKey]: event.target.value,
    });
  };

  // Handle Save button
  const handleSave = () => {
    setIsEditing(false);
    onSave({ url, alt, styles });  // Save the updated image data
  };

  // Enable editing mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handle file upload (converts to data URL)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUrl(reader.result as string);  // Set the image URL to the uploaded file's data URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="image-widget">
      {isEditing ? (
        <div>
          {/* URL input */}
          <input
            type="text"
            placeholder="Enter image URL"
            value={url}
            onChange={handleUrlChange}
            className="url-input"
          />
          
          {/* Alt text input */}
          <input
            type="text"
            placeholder="Enter image description (alt text)"
            value={alt}
            onChange={handleAltChange}
            className="alt-input"
          />

          {/* File upload */}
          <input type="file" accept="image/*" onChange={handleFileUpload} />

          {/* Style inputs (width/height) */}
          <input
            type="text"
            placeholder="Width (e.g., 100px or 100%)"
            value={styles.width}
            onChange={(e) => handleStyleChange(e, 'width')}
            className="style-input"
          />
          <input
            type="text"
            placeholder="Height (e.g., 100px or auto)"
            value={styles.height}
            onChange={(e) => handleStyleChange(e, 'height')}
            className="style-input"
          />
          <input
            type="text"
            placeholder="Border (e.g., 1px solid #000)"
            value={styles.border}
            onChange={(e) => handleStyleChange(e, 'border')}
            className="style-input"
          />

          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div className="image-widget-display" onClick={handleEdit}>
          {/* Image display */}
          <img src={url} alt={alt} style={styles} className="image" />
          <button>Edit Image</button>
        </div>
      )}
    </div>
  );
};

export default ImageWidget;
