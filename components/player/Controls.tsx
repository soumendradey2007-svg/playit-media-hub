"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  Tv,
  Camera,
  RotateCcw,
  RotateCw,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { PlaybackState } from "@/types/player";

interface ControlsProps {
  state: PlaybackState;
  isFullscreen?: boolean;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSeekRelative: (seconds: number) => void;
  onSeekByRatio: (ratio: number) => void;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  onCycleSpeed: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onCaptureSnapshot: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onToggleLoop: () => void;
  onToggleShuffle: () => void;
  isVideo: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  state,
  isFullscreen = false,
  onTogglePlay,
  onSeek,
  onSeekRelative,
  onSeekByRatio,
  onSetVolume,
  onToggleMute,
  onCycleSpeed,
  onToggleFullscreen,
  onTogglePiP,
  onCaptureSnapshot,
  onPlayNext,
  onPlayPrevious,
  onToggleLoop,
  onToggleShuffle,
  isVideo,
}) => {
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return "00:00";
    const totalSecs = Math.floor(seconds);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;

    if (hrs > 0) {
      return (hrs < 10 ? "0" : "") + hrs + ":" + (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
    }
    return (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "") + secs;
  };

  const handleTimelineHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setHoverX(e.clientX - rect.left);
    setHoverTime(pos * (state.duration || 0));
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeekByRatio(pos);
  };

  const progressPercent = (state.duration > 0 && isFinite(state.duration))
    ? Math.min(100, Math.max(0, (state.currentTime / state.duration) * 100))
    : 0;

  const bufferedPercent = (state.duration > 0 && isFinite(state.duration))
    ? Math.min(100, Math.max(0, (state.buffered / state.duration) * 100))
    : 0;

  return (
    <div
      className={"w-full p-4 flex flex-col gap-2.5 select-none transition-all " + (
        isFullscreen
          ? "bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white"
          : "bg-surface-bright/95 backdrop-blur-md border-t border-outline text-text-body rounded-b-large shadow-lg"
      )}
    >
      {/* Interactive Timeline Seekbar */}
      <div
        className="relative group cursor-pointer w-full py-2.5 flex items-center"
        onMouseMove={handleTimelineHover}
        onMouseLeave={() => setHoverTime(null)}
        onClick={handleTimelineClick}
      >
        {hoverTime !== null && state.duration > 0 && (
          <div
            className="absolute -top-8 px-2 py-0.5 bg-black/90 text-white text-[11px] rounded font-mono shadow-lg pointer-events-none -translate-x-1/2 border border-white/20 z-30"
            style={{ left: hoverX + "px" }}
          >
            {formatTime(hoverTime)}
          </div>
        )}

        <div className="relative w-full h-1.5 group-hover:h-2.5 bg-white/20 rounded-full transition-all overflow-hidden">
          {/* Buffered Track */}
          <div
            className="absolute top-0 left-0 h-full bg-white/30 rounded-full pointer-events-none"
            style={{ width: bufferedPercent + "%" }}
          />
          {/* Active Played Orange Track */}
          <div
            className="absolute top-0 left-0 h-full bg-primary rounded-full pointer-events-none"
            style={{ width: progressPercent + "%" }}
          />
        </div>

        {/* Orange Scrubber Knob (Always positioned accurately at progressPercent) */}
        <div
          className="absolute w-3.5 h-3.5 bg-primary border-2 border-white rounded-full shadow-md -translate-x-1/2 pointer-events-none z-20 transition-transform group-hover:scale-125"
          style={{ left: progressPercent + "%" }}
        />
      </div>

      {/* Control Actions Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        {/* Left: Prev, -10s, Play/Pause, +10s, Next, Live Runtime */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            onClick={onPlayPrevious}
            className={"p-1.5 rounded-standard transition-colors " + (
              isFullscreen ? "hover:bg-white/10 text-white/80 hover:text-white" : "hover:bg-surface-dim text-text-muted hover:text-text-header"
            )}
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSeekRelative(-10)}
            className={"p-1.5 sm:px-2 sm:py-1 rounded-standard text-xs font-semibold flex items-center gap-0.5 transition-all " + (
              isFullscreen
                ? "hover:bg-white/15 text-white/90 hover:text-white"
                : "hover:bg-surface-dim text-text-body hover:text-primary"
            )}
            title="Rewind 10s"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] font-mono">10s</span>
          </button>

          <button
            onClick={onTogglePlay}
            className="w-11 h-11 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center shadow-sahara-lg transition-transform duration-200 hover:scale-105 active:scale-95"
            title={state.isPlaying ? "Pause (Space)" : "Play (Space)"}
          >
            {state.isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onSeekRelative(10)}
            className={"p-1.5 sm:px-2 sm:py-1 rounded-standard text-xs font-semibold flex items-center gap-0.5 transition-all " + (
              isFullscreen
                ? "hover:bg-white/15 text-white/90 hover:text-white"
                : "hover:bg-surface-dim text-text-body hover:text-primary"
            )}
            title="Forward 10s"
          >
            <span className="text-[11px] font-mono">10s</span>
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onPlayNext}
            className={"p-1.5 rounded-standard transition-colors " + (
              isFullscreen ? "hover:bg-white/10 text-white/80 hover:text-white" : "hover:bg-surface-dim text-text-muted hover:text-text-header"
            )}
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* EXACT LIVE RUNTIME INDICATOR */}
          <div className={"text-xs font-mono ml-2.5 flex items-center gap-1 " + (isFullscreen ? "text-white/90" : "text-text-muted")}>
            <span className={"font-semibold " + (isFullscreen ? "text-white font-bold" : "text-text-header font-bold")}>
              {formatTime(state.currentTime)}
            </span>
            <span className="opacity-60">/</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onCycleSpeed}
            className={"px-2.5 py-1 rounded-standard text-xs font-semibold border transition-colors " + (
              isFullscreen
                ? "border-white/20 text-white hover:border-primary hover:bg-white/10"
                : "border-outline text-text-header hover:border-primary hover:bg-surface-dim"
            )}
            title="Cycle Speed"
          >
            {state.playbackRate.toFixed(1)}x
          </button>

          <button
            onClick={onToggleShuffle}
            className={"p-2 rounded-standard transition-colors " + (
              state.isShuffle
                ? "text-primary bg-primary/10 font-bold"
                : isFullscreen
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-text-muted hover:text-text-header hover:bg-surface-dim"
            )}
            title="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleLoop}
            className={"p-2 rounded-standard transition-colors " + (
              state.loop !== "none"
                ? "text-primary bg-primary/10 font-bold"
                : isFullscreen
                ? "text-white/80 hover:text-white hover:bg-white/10"
                : "text-text-muted hover:text-text-header hover:bg-surface-dim"
            )}
            title={"Loop: " + state.loop}
          >
            {state.loop === "one" ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </button>

          {/* Volume Control */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              onClick={onToggleMute}
              className={"p-1.5 rounded-standard transition-colors " + (
                isFullscreen ? "hover:bg-white/10 text-white" : "hover:bg-surface-dim text-text-body"
              )}
            >
              {state.isMuted || state.volume === 0 ? (
                <VolumeX className="w-4 h-4 text-tertiary" />
              ) : state.volume < 0.5 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={state.isMuted ? 0 : state.volume}
              onChange={(e) => onSetVolume(parseFloat(e.target.value))}
              className="w-16 sm:w-20 h-1 bg-white/30 rounded cursor-pointer accent-primary"
            />
          </div>

          {isVideo && (
            <>
              <button
                onClick={onCaptureSnapshot}
                className={"p-2 rounded-standard transition-colors hidden sm:flex " + (
                  isFullscreen ? "hover:bg-white/10 text-white/80 hover:text-white" : "hover:bg-surface-dim text-text-muted hover:text-text-header"
                )}
                title="Screenshot (S)"
              >
                <Camera className="w-4 h-4" />
              </button>
              <button
                onClick={onTogglePiP}
                className={"p-2 rounded-standard transition-colors hidden sm:flex " + (
                  isFullscreen ? "hover:bg-white/10 text-white/80 hover:text-white" : "hover:bg-surface-dim text-text-muted hover:text-text-header"
                )}
                title="Picture-in-Picture (P)"
              >
                <Tv className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={onToggleFullscreen}
            className={"p-2 rounded-standard transition-colors " + (
              isFullscreen ? "hover:bg-white/10 text-white" : "hover:bg-surface-dim text-text-muted hover:text-text-header"
            )}
            title="Fullscreen (F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
