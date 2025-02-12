// TextBox.tsx

import { CSSProperties } from 'react';

const TextBoxStyle: CSSProperties = {
  padding: '9px',
  margin: '10px 0',
  backgroundColor: '#fafafa',
  border: '1px solid #ddd',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  borderRadius: '4px',
  width: '100%',
  textAlign: 'center',
};

interface TextBoxProps {
  content: string;  
}
/*
const TextBox: React.FC<TextBoxProps> = ({ content }) => {
  return (
    <div style={TextBoxStyle}>
      {content}
    </div>
  );
};*/
//gpt generated 
//needs review 
//text box widget w/ save functionality

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



export default TextBox;
