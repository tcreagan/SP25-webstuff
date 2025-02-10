//gpt generated 
//needs review 

import React, { useState } from 'react';

interface TextBlockProps {
  content: string;
  onSave: (content: string) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ content, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(content);

  // Handle text change
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  // Handle save
  const handleSave = () => {
    setIsEditing(false);
    onSave(text);  // Save the edited text
  };

  // Enable editing mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="text-block">
      {isEditing ? (
        <div>
          <textarea value={text} onChange={handleChange} />
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div onClick={handleEdit}>
          <p>{text}</p>
          <button>Edit</button>
        </div>
      )}
    </div>
  );
};

export default TextBlock;
