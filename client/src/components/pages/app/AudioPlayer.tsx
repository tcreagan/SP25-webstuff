// AudioPlayer.tsx
import React from 'react';

interface AudioPlayerProps {
  content: string; // Could be a URL to an audio file
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ content }) => {
  return (
    <div>
      <audio controls>
        <source src={content} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
