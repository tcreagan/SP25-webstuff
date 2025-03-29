import React, { useState, useEffect } from "react";
import { createClient, Photo } from "pexels";
import "../../styles/sidebar.scss";

const apikey = process.env.REACT_APP_PEXELS_API_KEY; // Use the Pexels API key
const client = createClient(apikey || "");  // Pass the API key to the client

const ImageGallery = ({ onSelect }: { onSelect: (url: string) => void }) => {
  const [images, setImages] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Pexels API Key:", apikey);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null); // Clear any previous error
      try {
        const query = "Nature";
        const res = await client.photos.search({ query, per_page: 10 });
        if (res && "photos" in res && res.photos) {
          setImages(res.photos);
        } else {
          setError("No photos found");
        }
      } catch (error) {
        setError("Error fetching images from Pexels");
        console.error("Error fetching images from Pexels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="image-gallery">
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}
      <div className="grid">
        {images.map((img) => (
          <div key={img.id} style={{ position: "relative" }}>
            <img
              src={img.src.medium}
              alt={img.alt || "No description available"}
              onClick={() => onSelect(img.src.medium)}
              style={{ cursor: "pointer", width: "100%", height: "auto" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
