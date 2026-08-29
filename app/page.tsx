"use client";

import React, { useState, useEffect } from "react";
import { useMediaPlayer } from "@/hooks/useMediaPlayer";
import { SideNav } from "@/components/layout/SideNav";
import { TopNav } from "@/components/layout/TopNav";
import { PlayerViewport } from "@/components/player/PlayerViewport";
import { RecentUploads } from "@/components/player/RecentUploads";
import { DropZone } from "@/components/upload/DropZone";
import { IngestQueue } from "@/components/upload/IngestQueue";
import { EqualizerModal } from "@/components/modals/EqualizerModal";
import { ShortcutsModal } from "@/components/modals/ShortcutsModal";
import { AlertTriangle, X } from "lucide-react";
import { MediaItem } from "@/types/player";

export default function Home() {
  const player = useMediaPlayer();
  const [currentView, setCurrentView] = useState<"dashboard" | "upload" | "queue" | "history" | "favorites">("dashboard");
  const [isEqOpen, setIsEqOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("playit-theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const nextMode = !prev;
      if (nextMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("playit-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("playit-theme", "light");
      }
      return nextMode;
    });
  };

  const handlePlayFromQueue = (id: string) => {
    const targetIdx = player.playlist.findIndex((p) => p.id === id);
    if (targetIdx !== -1) {
      player.setCurrentIndex(targetIdx);
      setCurrentView("dashboard");
    }
  };

  const handleAddRemoteUrl = (url: string) => {
    const filename = url.split("/").pop()?.split("?")[0] || "Online Stream";
    const isAudio = /\.(mp3|wav|ogg|flac|aac|m4a)$/i.test(filename);
    const newMedia: MediaItem = {
      id: Math.random().toString(36).substring(2, 9),
      title: decodeURIComponent(filename),
      artist: "Internet Stream",
      url,
      type: isAudio ? "audio" : "video",
      format: url.split(".").pop()?.toUpperCase().slice(0, 4) || "STREAM",
      size: 0,
      duration: 0,
    };

    player.setPlaylist((prev) => [newMedia, ...prev]);
    player.setCurrentIndex(0);
    setCurrentView("dashboard");
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        player.togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        player.seekRelative(-5);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        player.seekRelative(5);
      } else if (e.code === "KeyJ") {
        e.preventDefault();
        player.seekRelative(-10);
      } else if (e.code === "KeyL") {
        e.preventDefault();
        player.seekRelative(10);
      } else if (e.code === "KeyM") {
        e.preventDefault();
        player.toggleMute();
      } else if (e.code === "KeyS") {
        e.preventDefault();
        player.captureSnapshot();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [player]);

  return (
    <div className="min-h-screen bg-surface flex transition-colors">
      <SideNav
        currentView={currentView}
        onViewChange={setCurrentView}
        onUploadClick={() => setCurrentView("upload")}
        playlistCount={player.playlist.length}
      />

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopNav
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
          onOpenUploadStudio={() => setCurrentView("upload")}
          onOpenEqualizer={() => setIsEqOpen(true)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onUploadNative={player.addFilesToIngest}
        />

        {player.uploadError && (
          <div className="mx-6 mt-4 p-4 rounded-large bg-tertiary/10 border border-tertiary/30 text-tertiary flex items-center justify-between shadow-md animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 text-tertiary" />
              <div className="text-xs font-semibold">
                <span className="font-bold">Upload Exceeded: </span>
                {player.uploadError}
              </div>
            </div>
            <button
              onClick={() => player.setUploadError(null)}
              className="p-1 rounded-standard hover:bg-tertiary/20 text-tertiary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
          {currentView === "dashboard" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 w-full">
                <PlayerViewport
                  mediaRef={player.mediaRef}
                  analyserNode={player.analyserNode}
                  currentTrack={player.currentTrack}
                  state={player.state}
                  onTogglePlay={player.togglePlay}
                  onSeek={player.seek}
                  onSeekRelative={player.seekRelative}
                  onSeekByRatio={player.seekByRatio}
                  onSetVolume={player.setVolume}
                  onToggleMute={player.toggleMute}
                  onCycleSpeed={player.cycleSpeed}
                  onToggleFullscreen={player.toggleFullscreen}
                  onTogglePiP={player.togglePiP}
                  onCaptureSnapshot={player.captureSnapshot}
                  onPlayNext={player.playNext}
                  onPlayPrevious={player.playPrevious}
                  onToggleLoop={() => {
                    const next = player.state.loop === "none" ? "one" : player.state.loop === "one" ? "all" : "none";
                    player.setState((s) => ({ ...s, loop: next }));
                  }}
                  onToggleShuffle={() => {
                    player.setState((s) => ({ ...s, isShuffle: !s.isShuffle }));
                  }}
                />
              </div>

              <div className="w-full">
                <RecentUploads
                  tracks={player.playlist}
                  currentIndex={player.currentIndex}
                  onSelectTrack={(i) => player.setCurrentIndex(i)}
                  onToggleFavorite={player.toggleFavorite}
                  onViewAll={() => setCurrentView("queue")}
                />
              </div>
            </div>
          )}

          {currentView === "upload" && (
            <div className="flex flex-col gap-6">
              <DropZone onFilesDropped={player.addFilesToIngest} onAddRemoteUrl={handleAddRemoteUrl} />
              <IngestQueue items={player.ingestQueue} onPlayItem={handlePlayFromQueue} />
            </div>
          )}

          {currentView === "queue" && (
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl font-bold text-text-header">Playback Library & Queue</h2>
              <RecentUploads
                tracks={player.playlist}
                currentIndex={player.currentIndex}
                onSelectTrack={(i) => {
                  player.setCurrentIndex(i);
                  setCurrentView("dashboard");
                }}
                onToggleFavorite={player.toggleFavorite}
              />
            </div>
          )}

          {currentView === "history" && (
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl font-bold text-text-header">Playback History</h2>
              <RecentUploads
                tracks={player.history}
                currentIndex={-1}
                onSelectTrack={(i) => {
                  const item = player.history[i];
                  const pIdx = player.playlist.findIndex((x) => x.id === item.id);
                  if (pIdx !== -1) player.setCurrentIndex(pIdx);
                  setCurrentView("dashboard");
                }}
                onToggleFavorite={player.toggleFavorite}
              />
            </div>
          )}

          {currentView === "favorites" && (
            <div className="flex flex-col gap-4">
              <h2 className="font-serif text-2xl font-bold text-text-header">Favorite Tracks</h2>
              <RecentUploads
                tracks={player.playlist.filter((t) => t.isFavorite)}
                currentIndex={-1}
                onSelectTrack={(i) => {
                  const item = player.playlist.filter((t) => t.isFavorite)[i];
                  const pIdx = player.playlist.findIndex((x) => x.id === item.id);
                  if (pIdx !== -1) player.setCurrentIndex(pIdx);
                  setCurrentView("dashboard");
                }}
                onToggleFavorite={player.toggleFavorite}
              />
            </div>
          )}
        </main>
      </div>

      <EqualizerModal
        isOpen={isEqOpen}
        onClose={() => setIsEqOpen(false)}
        bands={player.eqBands}
        onBandChange={player.updateEqBand}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}