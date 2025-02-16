import React, { useState } from 'react';

interface ImageWidgetProps {
  imageUrl: string;
  onSave: (imageUrl: string) => void;
}

const ImageWidget: React.FC<ImageWidgetProps> = ({ imageUrl, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [url, setUrl] = useState(imageUrl);

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  // Handle Save button
  const handleSave = () => {
    setIsEditing(false);
    onSave(url);  // Save the updated image URL
  };

  // Enable editing mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="image-widget">
      {isEditing ? (
        <div>
          <input
            type="text"
            placeholder="Enter image URL"
            value={url}
            onChange={handleUrlChange}
          />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div onClick={handleEdit}>
          <img src={url} alt="Widget Image" />
          <button>Edit Image</button>
        </div>
      )}
    </div>
  );
};

export default ImageWidget;
