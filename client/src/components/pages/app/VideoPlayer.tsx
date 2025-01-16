// VideoPlayer.tsx
import React from "react";

interface VideoPlayerProps {
  content: string; // Could be a URL to a video file
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ content }) => {
  return (
    <div>
      <video width="320" height="240" controls>
        <source src={content} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
