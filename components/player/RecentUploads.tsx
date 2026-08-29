"use client";
import React from "react";
import { MediaItem } from "@/types/player";
import { Music, Film, Heart, Sparkles } from "lucide-react";
interface RecentUploadsProps {
  tracks: MediaItem[];
  currentIndex: number;
  onSelectTrack: (index: number) => void;
  onToggleFavorite: (id: string) => void;
  onViewAll?: () => void;
}
export const RecentUploads: React.FC<RecentUploadsProps> = ({
  tracks,
  currentIndex,
  onSelectTrack,
  onToggleFavorite,
  onViewAll,
}) => {
  const formatDuration = (sec: number) => {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  return (
    <div className="sahara-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-outline pb-3">
        <h2 className="font-serif text-xl font-bold text-text-header">Recent Uploads</h2>
        {tracks.length > 0 && (
          <button onClick={onViewAll} className="text-xs font-semibold text-primary hover:underline">
            View All
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {tracks.length === 0 ? (
          <div className="py-10 flex flex-col items-center justify-center text-center gap-2 text-text-muted">
            <div className="w-12 h-12 rounded-full bg-outline/40 flex items-center justify-center mb-1">
              <Sparkles className="w-5 h-5 text-primary opacity-60" />
            </div>
            <p className="text-xs font-medium text-text-header">No media uploaded yet</p>
            <p className="text-[11px] opacity-70 max-w-[200px]">
              Drop your video or audio files in the player or Upload Studio
            </p>
          </div>
        ) : (
          tracks.map((track, idx) => {
            const isActive = idx === currentIndex;
            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(idx)}
                className={`group flex items-center justify-between p-3 rounded-standard cursor-pointer transition-all border ${
                  isActive
                    ? "bg-surface-dim border-primary/40 shadow-sm"
                    : "bg-surface-bright border-outline/40 hover:bg-surface-dim"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div
                    className={`w-9 h-9 rounded-standard flex items-center justify-center shrink-0 ${
                      isActive ? "bg-primary text-white" : "bg-outline/50 text-text-muted"
                    }`}
                  >
                    {track.type === "video" ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold text-text-header truncate group-hover:text-primary transition-colors">
                      {track.title}
                    </span>
                    <span className="text-xs text-text-muted truncate">{track.artist}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-outline/40 text-text-body font-bold">
                    {track.format}
                  </span>
                  <span className="text-xs font-mono text-text-muted">{formatDuration(track.duration)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(track.id);
                    }}
                    className="p-1 text-text-muted hover:text-primary transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${track.isFavorite ? "fill-primary text-primary" : ""}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};