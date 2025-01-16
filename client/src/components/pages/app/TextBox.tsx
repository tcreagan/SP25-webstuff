// TextBox.tsx
import React from 'react';
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

const TextBox: React.FC<TextBoxProps> = ({ content }) => {
  return (
    <div style={TextBoxStyle}>
      {content}
    </div>
  );
};

export default TextBox;
