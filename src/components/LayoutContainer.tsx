import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { ScreenPreview } from './ScreenPreview';
import { VoiceRecorder } from './VoiceRecorder';
import { AIResponse } from './AIResponse';
import { Sidebar } from './Sidebar';
import { useScreenCapture } from '../hooks/useScreenCapture';
import { useRealtimeVoice } from '../hooks/useRealtimeVoice';
import { User } from '../types';

interface LayoutContainerProps {
  user: User;
  onSignOut: () => void;
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({ user, onSignOut }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [screenContext, setScreenContext] = useState<string>('');

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

  const { isCapturing, stream, startCapture, stopCapture, captureFrame } = useScreenCapture();

  const {
    isConnected,
    isRecording,
    isProcessing,
    transcript,
    aiResponse,
    error,
    connect,
    startRecording,
    stopRecording,
    clearResponses
  } = useRealtimeVoice(apiKey);

  React.useEffect(() => {
    connect();
  }, [connect]);

  const handleStartSharing = useCallback(async () => {
    await startCapture();
  }, [startCapture]);

  const handleStopSharing = useCallback(() => {
    stopCapture();
    setScreenContext('');
  }, [stopCapture]);

  const handleClearHistory = useCallback(() => {
    clearResponses();
  }, [clearResponses]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header
        isScreenSharing={isCapturing}
        isVoiceActive={isRecording}
        onSignOut={onSignOut}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ScreenPreview
          stream={stream}
          onStartSharing={handleStartSharing}
          onStopSharing={handleStopSharing}
          isSharing={isCapturing}
        />

        <AIResponse
          transcript={transcript}
          aiResponse={aiResponse}
          isProcessing={isProcessing}
        />

        <VoiceRecorder
          isRecording={isRecording}
          isProcessing={isProcessing}
          isConnected={isConnected}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          error={error}
        />
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};
