import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';

interface ResizableImageWidgetProps {
  initialUrl: string;
  initialAlt: string;
  initialStyles?: React.CSSProperties;
  onSave: (data: { url: string; alt: string; styles: React.CSSProperties }) => void;
}

const ResizableImageWidget: React.FC<ResizableImageWidgetProps> = ({
  initialUrl,
  initialAlt,
  initialStyles = {},
  onSave,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [alt, setAlt] = useState(initialAlt);
  const [styles, setStyles] = useState<React.CSSProperties>(initialStyles);

  // Handle resizing (React-Resizable provides width and height)
  const handleResize = (event: any, data: { size: { width: number; height: number } }) => {
    setStyles({
      ...styles,
      width: data.size.width,
      height: data.size.height,
    });
  };

  // Handle Save button
  const handleSave = () => {
    onSave({ url, alt, styles }); // Save the updated image data
  };

  return (
    <ResizableBox
      width={styles.width ? parseInt(styles.width as string, 10) : 200}  // Initial width
      height={styles.height ? parseInt(styles.height as string, 10) : 200}  // Initial height
      resizeHandles={['se']}  // South-East corner for resizing
      onResize={handleResize}  // Resize handler
      minConstraints={[100, 100]}  // Minimum width and height
      maxConstraints={[600, 400]}  // Maximum width and height
    >
      <div className="resizable-image-widget">
        <img src={url} alt={alt} style={{ width: '100%', height: '100%' }} />
        <button onClick={handleSave}>Save</button>
      </div>
    </ResizableBox>
  );
};

export default ResizableImageWidget;
