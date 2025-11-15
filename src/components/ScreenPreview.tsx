import React, { useRef, useEffect } from 'react';
import { Monitor, Play } from 'lucide-react';

interface ScreenPreviewProps {
  stream: MediaStream | null;
  onStartSharing: () => void;
  onStopSharing: () => void;
  isSharing: boolean;
}

export const ScreenPreview: React.FC<ScreenPreviewProps> = ({
  stream,
  onStartSharing,
  onStopSharing,
  isSharing
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    }
  }, [stream]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 border border-black">
      {isSharing && stream ? (
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            autoPlay
            muted
            playsInline
          />
          <button
            onClick={onStopSharing}
            className="absolute top-16 right-16 font-mono text-sm px-16 py-8 bg-white border border-black hover:bg-black hover:text-white transition-colors"
          >
            STOP SHARING
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-24">
          <Monitor className="w-64 h-64 text-gray-400" strokeWidth={1} />
          <div className="text-center space-y-16">
            <p className="font-mono text-sm text-gray-600">NO SCREEN SHARED</p>
            <button
              onClick={onStartSharing}
              className="font-mono text-sm px-24 py-16 border border-black hover:bg-black hover:text-white transition-colors flex items-center gap-8"
            >
              <Play className="w-16 h-16" />
              START SHARING
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
