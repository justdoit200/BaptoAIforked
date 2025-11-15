import React from 'react';
import { Volume2 } from 'lucide-react';

interface AIResponseProps {
  transcript: string;
  aiResponse: string;
  isProcessing: boolean;
}

export const AIResponse: React.FC<AIResponseProps> = ({ transcript, aiResponse, isProcessing }) => {
  if (!transcript && !aiResponse && !isProcessing) {
    return null;
  }

  return (
    <div className="px-24 py-24 bg-white border-t border-black">
      <div className="max-w-4xl mx-auto space-y-16">
        {transcript && (
          <div className="space-y-8">
            <p className="font-mono text-xs text-gray-600">YOU SAID:</p>
            <p className="font-mono text-sm text-gray-900 leading-relaxed">{transcript}</p>
          </div>
        )}

        {(aiResponse || isProcessing) && (
          <div className="space-y-8 border-t border-gray-300 pt-16">
            <div className="flex items-center gap-8">
              <Volume2 className="w-16 h-16 text-gray-600" />
              <p className="font-mono text-xs text-gray-600">AI RESPONSE:</p>
            </div>
            {isProcessing && !aiResponse ? (
              <div className="flex items-center gap-8">
                <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse" />
                <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-8 h-8 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            ) : (
              <p className="font-mono text-sm text-black leading-relaxed whitespace-pre-wrap">
                {aiResponse}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
