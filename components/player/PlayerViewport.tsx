"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { MediaItem, PlaybackState } from "@/types/player";
import { Controls } from "./Controls";
import { AudioVisualizer } from "./AudioVisualizer";
import { Music } from "lucide-react";

interface PlayerViewportProps {
  mediaRef: React.RefObject<HTMLVideoElement>;
  analyserNode: AnalyserNode | null;
  currentTrack: MediaItem | null;
  state: PlaybackState;
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onSeekRelative: (seconds: number) => void;
  onSeekByRatio: (ratio: number) => void;
  onSetVolume: (vol: number) => void;
  onToggleMute: () => void;
  onCycleSpeed: () => void;
  onToggleFullscreen: (elem: HTMLElement | null) => void;
  onTogglePiP: () => void;
  onCaptureSnapshot: () => void;
  onPlayNext: () => void;
  onPlayPrevious: () => void;
  onToggleLoop: () => void;
  onToggleShuffle: () => void;
  onTimeUpdate: () => void;
  onLoadedMetadata: () => void;
  onPlay: () => void;
  onPause: () => void;
  onEnded: () => void;
  onProgress: () => void;
}

export const PlayerViewport: React.FC<PlayerViewportProps> = ({
  mediaRef,
  analyserNode,
  currentTrack,
  state,
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
  onTimeUpdate,
  onLoadedMetadata,
  onPlay,
  onPause,
  onEnded,
  onProgress,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isHoveringControlsRef = useRef<boolean>(false);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setShowControls(true);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const triggerActivity = useCallback(() => {
    setShowControls(true);

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    if (state.isPlaying && !isHoveringControlsRef.current) {
      hideTimerRef.current = setTimeout(() => {
        if (!isHoveringControlsRef.current) {
          setShowControls(false);
        }
      }, 4500);
    }
  }, [state.isPlaying]);

  useEffect(() => {
    if (!state.isPlaying) {
      setShowControls(true);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    } else {
      triggerActivity();
    }
  }, [state.isPlaying, triggerActivity]);

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerActivity}
      onClick={triggerActivity}
      className={`relative w-full overflow-hidden select-none bg-black transition-all ${isFullscreen ? "h-screen w-screen flex flex-col justify-center items-center" : "sahara-card aspect-video flex flex-col justify-between shadow-sahara"} ${!showControls && state.isPlaying ? "cursor-none" : "cursor-default"}`}
    >
      <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
        {currentTrack ? (
          <>
            <video
              ref={mediaRef}
              src={currentTrack.url}
              className={`w-full h-full object-contain ${isFullscreen ? "max-h-screen" : ""}`}
              playsInline
              onTimeUpdate={onTimeUpdate}
              onDurationChange={onTimeUpdate}
              onLoadedMetadata={onLoadedMetadata}
              onLoadedData={onTimeUpdate}
              onCanPlay={onTimeUpdate}
              onPlay={onPlay}
              onPause={onPause}
              onEnded={onEnded}
              onProgress={onProgress}
            />

            {currentTrack.type === "audio" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#2d241e] to-[#1a1715]">
                <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-primary shadow-sahara-lg mb-3">
                  <Music className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-white text-center">{currentTrack.title}</h3>
                <p className="text-xs font-medium text-[#d8d0c8] mt-0.5">{currentTrack.artist}</p>
                <AudioVisualizer analyserNode={analyserNode} isPlaying={state.isPlaying} />
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-text-muted text-xs p-8">
            <p>No track loaded. Please upload media to start.</p>
          </div>
        )}
      </div>

      <div
        className="absolute inset-0 z-20 cursor-default"
        onMouseMove={triggerActivity}
        onPointerMove={triggerActivity}
        onClick={() => {
          onTogglePlay();
          triggerActivity();
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onToggleFullscreen(containerRef.current);
        }}
      />

      {currentTrack && (
        <div
          className={`absolute top-4 left-4 glassmorphic px-4 py-2.5 rounded-standard bg-black/75 backdrop-blur-md border border-white/20 flex items-center gap-3 shadow-lg transition-all duration-300 pointer-events-none z-30 ${showControls || !state.isPlaying ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">{currentTrack.title}</span>
            <span className="text-[11px] text-white/70 font-medium">{currentTrack.artist}</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-white/20 pl-3">
            <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-primary text-white">{currentTrack.format}</span>
            {currentTrack.sampleRate && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-white">{currentTrack.sampleRate}</span>
            )}
          </div>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 z-40 transition-all duration-300 ease-out ${showControls || !state.isPlaying ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-6 pointer-events-none"}`}
        onMouseEnter={() => {
          isHoveringControlsRef.current = true;
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
          setShowControls(true);
        }}
        onMouseLeave={() => {
          isHoveringControlsRef.current = false;
          triggerActivity();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Controls
          state={state}
          isFullscreen={isFullscreen}
          onTogglePlay={onTogglePlay}
          onSeek={onSeek}
          onSeekRelative={onSeekRelative}
          onSeekByRatio={onSeekByRatio}
          onSetVolume={onSetVolume}
          onToggleMute={onToggleMute}
          onCycleSpeed={onCycleSpeed}
          onToggleFullscreen={() => onToggleFullscreen(containerRef.current)}
          onTogglePiP={onTogglePiP}
          onCaptureSnapshot={onCaptureSnapshot}
          onPlayNext={onPlayNext}
          onPlayPrevious={onPlayPrevious}
          onToggleLoop={onToggleLoop}
          onToggleShuffle={onToggleShuffle}
          isVideo={currentTrack?.type === "video"}
        />
      </div>
    </div>
  );
};