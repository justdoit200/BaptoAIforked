import React from 'react';
import { Mic, Square } from 'lucide-react';

interface VoiceRecorderProps {
  isRecording: boolean;
  isProcessing: boolean;
  isConnected: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  error?: string | null;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  isProcessing,
  isConnected,
  onStartRecording,
  onStopRecording,
  error
}) => {
  const handleClick = () => {
    if (isRecording) {
      onStopRecording();
    } else {
      onStartRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-16 p-24 bg-white border-t border-black">
      {error && (
        <div className="w-full p-16 bg-red-50 border border-red-600 font-mono text-sm text-red-600">
          ERROR: {error}
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={isProcessing || !isConnected}
        className={`
          w-96 h-96 rounded-full border-2 flex items-center justify-center transition-all
          ${isRecording
            ? 'border-red-600 bg-red-600 text-white animate-pulse'
            : 'border-black bg-white text-black hover:bg-black hover:text-white'
          }
          ${(isProcessing || !isConnected) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isRecording ? (
          <Square className="w-48 h-48" fill="currentColor" />
        ) : (
          <Mic className="w-48 h-48" />
        )}
      </button>

      <div className="text-center space-y-8">
        <p className="font-mono text-xs text-gray-600">
          {isProcessing
            ? 'PROCESSING...'
            : isRecording
            ? 'RECORDING - TAP TO STOP'
            : isConnected
            ? 'TAP TO RECORD'
            : 'CONNECTING...'}
        </p>
        {isRecording && (
          <div className="flex items-center justify-center gap-4">
            <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse" />
            <div className="w-8 h-16 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
            <div className="w-8 h-24 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-8 h-16 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
            <div className="w-8 h-8 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        )}
      </div>
    </div>
  );
};
