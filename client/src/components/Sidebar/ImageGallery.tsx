import React, { useState, useEffect } from "react";
import { createClient, Photo } from "pexels";
import "../../styles/sidebar.scss";

const apikey = process.env.REACT_APP_PEXELS_API_KEY || " "; // Pexels API key
const client = createClient(apikey);

const ImageGallery = ({ onSelect }: { onSelect: (url: string) => void }) => {
  const [images, setImages] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const query = "Nature";
        const res = await client.photos.search({ query, per_page: 10 }); // 10 images per page
        if (res && "photos" in res && res.photos) {
          setImages(res.photos);
        }
      } catch (error) {
        console.error("Error fetching images from Pexels:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="image-gallery">
      {images.map((img) => (
        <div key={img.id} style={{ position: "relative" }}>
          <img
            src={img.src.medium}
            alt={img.alt || "No description available"}
            onClick={() => onSelect(img.src.medium)}
            style={{ cursor: "pointer" }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
