import React from "react";
import ImageGallery from "./ImageGallery";  // Import the ImageGallery component

type Props = {};

const ImageGallerySidebar = (props: Props) => {
  const handleImageSelect = (url: string) => {
    console.log("Selected image URL:", url);
    // Handle what you want to do with the selected image URL here
  };

  return (
    <aside className="style-sidebar">
      <header className="sidebar-header">
        <h2>Image Gallery</h2>
      </header>
      <div className="image-gallery-container">
        {/* Use the ImageGallery component here */}
        <ImageGallery onSelect={handleImageSelect} />
      </div>
    </aside>
  );
};

export default ImageGallerySidebar;
