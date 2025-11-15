import React from 'react';
import { Monitor, Circle } from 'lucide-react';

interface HeaderProps {
  isScreenSharing: boolean;
  isVoiceActive: boolean;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isScreenSharing, isVoiceActive, onSignOut }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-mono tracking-tight">Bapto AI</h1>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-8">
              <Monitor className="w-16 h-16" />
              <span className="font-mono text-sm">
                {isScreenSharing ? 'SHARING' : 'NO SCREEN'}
              </span>
            </div>

            {isVoiceActive && (
              <div className="flex items-center gap-8">
                <Circle className="w-8 h-8 fill-red-600 text-red-600 animate-pulse" />
                <span className="font-mono text-sm text-red-600">RECORDING</span>
              </div>
            )}
          </div>
        </div>

        {onSignOut && (
          <button
            onClick={onSignOut}
            className="font-mono text-sm px-16 py-8 border border-black hover:bg-black hover:text-white transition-colors"
          >
            SIGN OUT
          </button>
        )}
      </div>
    </header>
  );
};
