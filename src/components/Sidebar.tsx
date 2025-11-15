import React, { useState } from 'react';
import { Settings, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onClearHistory?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle, onClearHistory }) => {
  const [sessions] = useState<Array<{ id: string; date: string; preview: string }>>([]);

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-80 right-0 z-40 p-8 bg-white border border-black border-r-0 hover:bg-black hover:text-white transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <ChevronRight className="w-16 h-16" /> : <ChevronLeft className="w-16 h-16" />}
      </button>

      <aside
        className={`
          fixed top-0 right-0 h-full w-320 bg-white border-l border-black z-30 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-24 border-b border-black">
            <div className="flex items-center gap-8">
              <Settings className="w-16 h-16" />
              <h2 className="font-mono text-sm">SETTINGS</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-24">
            <div className="space-y-24">
              <div>
                <h3 className="font-mono text-xs text-gray-600 mb-8">HISTORY</h3>
                {sessions.length === 0 ? (
                  <p className="font-mono text-xs text-gray-400">No conversations yet</p>
                ) : (
                  <div className="space-y-8">
                    {sessions.map((session) => (
                      <div key={session.id} className="p-16 border border-gray-300 hover:border-black transition-colors cursor-pointer">
                        <p className="font-mono text-xs text-gray-600 mb-4">{session.date}</p>
                        <p className="font-mono text-xs text-gray-900 truncate">{session.preview}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {onClearHistory && sessions.length > 0 && (
                <button
                  onClick={onClearHistory}
                  className="w-full font-mono text-xs px-16 py-8 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center justify-center gap-8"
                >
                  <Trash2 className="w-12 h-12" />
                  CLEAR HISTORY
                </button>
              )}
            </div>
          </div>

          <div className="p-24 border-t border-black">
            <div className="space-y-8 font-mono text-xs text-gray-600">
              <p>VERSION 1.0.0</p>
              <p>REALTIME VOICE AI</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
