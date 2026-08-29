"use client";

import React from "react";
import { Keyboard, X } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Space", desc: "Play / Pause" },
    { key: "← / →", desc: "Seek 5 seconds backward / forward" },
    { key: "↑ / ↓", desc: "Volume up / down" },
    { key: "M", desc: "Mute / Unmute audio" },
    { key: "F", desc: "Toggle Fullscreen" },
    { key: "P", desc: "Picture-in-Picture mode" },
    { key: "S", desc: "Capture HD video snapshot" },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="sahara-card w-full max-w-md p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-text-header">Keyboard Shortcuts</h2>
          </div>
          <button onClick={onClose} className="p-1 text-text-muted hover:text-text-header">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {shortcuts.map((s) => (
            <div key={s.key} className="flex items-center justify-between text-xs py-2 border-b border-outline/40">
              <span className="text-text-body">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-surface-dim border border-outline font-mono font-bold text-primary">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
