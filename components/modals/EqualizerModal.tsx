"use client";

import React from "react";
import { Sliders, X, RotateCcw } from "lucide-react";
import { EqualizerBand } from "@/types/player";

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bands: EqualizerBand[];
  onBandChange: (index: number, gain: number) => void;
}

const PRESETS: Record<string, number[]> = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0],
  "Warm Acoustic": [4, 3, 2, 1, 0, 2, 3, 2, 1],
  "Deep Bass": [7, 6, 4, 2, 0, 0, 0, 0, 0],
  "Vocal Clarity": [-2, -1, 0, 3, 5, 4, 2, 0, -1],
  Mastering: [2, 1, 0, 0, 1, 2, 3, 4, 3],
};

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  bands,
  onBandChange,
}) => {
  if (!isOpen) return null;

  const applyPreset = (gains: number[]) => {
    gains.forEach((g, i) => {
      if (i < bands.length) onBandChange(i, g);
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="sahara-card w-full max-w-xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-standard bg-primary/10 text-primary">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-text-header">Graphic Equalizer</h2>
              <p className="text-xs text-text-muted">Sahara Studio Acoustic Tuning</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-standard hover:bg-surface-dim text-text-muted hover:text-text-header">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(PRESETS).map(([name, values]) => (
            <button
              key={name}
              onClick={() => applyPreset(values)}
              className="px-3 py-1 text-xs font-semibold rounded-standard border border-outline bg-surface-dim hover:border-primary hover:text-primary transition-all"
            >
              {name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-9 gap-1 items-end h-44 bg-surface-dim p-4 rounded-large border border-outline">
          {bands.map((b, idx) => (
            <div key={b.frequency} className="flex flex-col items-center h-full justify-between">
              <span className="text-[10px] font-mono text-text-muted">{b.gain > 0 ? `+${b.gain}` : b.gain}</span>
              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={b.gain}
                onChange={(e) => onBandChange(idx, parseInt(e.target.value))}
                className="h-24 -rotate-90 w-24 cursor-pointer accent-primary"
              />
              <span className="text-[10px] font-mono font-semibold text-text-header">
                {b.frequency >= 1000 ? `${b.frequency / 1000}k` : b.frequency}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-outline pt-3">
          <button
            onClick={() => applyPreset(PRESETS.Flat)}
            className="flex items-center gap-1 text-xs text-text-muted hover:text-text-header"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Flat</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-standard bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sahara"
          >
            Apply Tuning
          </button>
        </div>
      </div>
    </div>
  );
};
