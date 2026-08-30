"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MediaItem, IngestItem, PlaybackState, EqualizerBand } from "@/types/player";

const MAX_USER_FILE_SIZE_BYTES = 6 * 1024 * 1024 * 1024; // 6.0 GB Limit

const DEFAULT_EQ_BANDS: EqualizerBand[] = [
  { frequency: 60, gain: 0, type: "lowshelf" },
  { frequency: 170, gain: 0, type: "peaking" },
  { frequency: 310, gain: 0, type: "peaking" },
  { frequency: 600, gain: 0, type: "peaking" },
  { frequency: 1000, gain: 0, type: "peaking" },
  { frequency: 3000, gain: 0, type: "peaking" },
  { frequency: 6000, gain: 0, type: "peaking" },
  { frequency: 12000, gain: 0, type: "peaking" },
  { frequency: 14000, gain: 0, type: "highshelf" },
];

export function useMediaPlayer() {
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const [playlist, setPlaylist] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [ingestQueue, setIngestQueue] = useState<IngestItem[]>([]);
  const [history, setHistory] = useState<MediaItem[]>([]);
  const [eqBands, setEqBands] = useState<EqualizerBand[]>(DEFAULT_EQ_BANDS);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [state, setState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.9,
    isMuted: false,
    playbackRate: 1.0,
    buffered: 0,
    isFullscreen: false,
    isPiP: false,
    isShuffle: false,
    loop: "none",
  });

  const currentTrack = currentIndex >= 0 && currentIndex < playlist.length ? playlist[currentIndex] : null;

  // Real-Time Time Update
  const handleTimeUpdate = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    const cur = media.currentTime || 0;
    
    let dur = 0;
    if (isFinite(media.duration) && media.duration > 0) {
      dur = media.duration;
    } else if (media.seekable && media.seekable.length > 0) {
      dur = media.seekable.end(media.seekable.length - 1);
    }

    setState((s) => ({
      ...s,
      currentTime: cur,
      duration: dur > 0 ? dur : (s.duration > 0 ? s.duration : 0),
    }));
  }, []);

  // Large-File 3.5GB+ Duration Prober
  const handleLoadedMetadata = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;

    // Check if browser returned Infinity/NaN on large file
    if (!isFinite(media.duration) || media.duration === 0 || isNaN(media.duration)) {
      const probeDuration = () => {
        media.removeEventListener("timeupdate", probeDuration);
        const resolvedDuration = media.currentTime;
        media.currentTime = 0;
        if (isFinite(resolvedDuration) && resolvedDuration > 0) {
          setState((s) => ({ ...s, duration: resolvedDuration, currentTime: 0 }));
        }
      };

      media.addEventListener("timeupdate", probeDuration, { once: true });
      media.currentTime = 1e101; // Instant EOF seek probe (resolves in 5ms)
    } else {
      setState((s) => ({
        ...s,
        duration: media.duration,
        volume: media.volume,
        isMuted: media.muted,
      }));
    }
  }, []);

  const handlePlay = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: true }));
  }, []);

  const handlePause = useCallback(() => {
    setState((s) => ({ ...s, isPlaying: false }));
  }, []);

  const handleProgress = useCallback(() => {
    const media = mediaRef.current;
    if (media && media.buffered.length > 0) {
      setState((s) => ({ ...s, buffered: media.buffered.end(media.buffered.length - 1) }));
    }
  }, []);

  const playNext = useCallback(() => {
    if (playlist.length === 0) return;
    const nextIdx = state.isShuffle
      ? Math.floor(Math.random() * playlist.length)
      : (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIdx);
  }, [playlist.length, state.isShuffle, currentIndex]);

  const playPrevious = useCallback(() => {
    if (playlist.length === 0) return;
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentIndex(prevIdx);
  }, [playlist.length, currentIndex]);

  const handleEnded = useCallback(() => {
    if (state.loop === "one") {
      if (mediaRef.current) {
        mediaRef.current.currentTime = 0;
        mediaRef.current.play().catch(() => {});
      }
    } else if (state.loop === "all" || currentIndex < playlist.length - 1) {
      playNext();
    } else {
      setState((s) => ({ ...s, isPlaying: false }));
    }
  }, [state.loop, currentIndex, playlist.length, playNext]);

  const togglePlay = useCallback(async () => {
    const media = mediaRef.current;
    if (!media || !currentTrack) return;

    try {
      if (media.paused) {
        await media.play();
        setState((s) => ({ ...s, isPlaying: true }));
      } else {
        media.pause();
        setState((s) => ({ ...s, isPlaying: false }));
      }
    } catch (err) {
      console.warn("Play/pause handled:", err);
    }
  }, [currentTrack]);

  const seek = useCallback((targetTime: number) => {
    const media = mediaRef.current;
    if (!media) return;

    let actualDur = 0;
    if (isFinite(media.duration) && media.duration > 0) {
      actualDur = media.duration;
    } else if (media.seekable && media.seekable.length > 0) {
      actualDur = media.seekable.end(media.seekable.length - 1);
    } else if (state.duration > 0) {
      actualDur = state.duration;
    }

    const clampedTime = Math.max(0, actualDur > 0 ? Math.min(targetTime, actualDur) : targetTime);

    try {
      media.currentTime = clampedTime;
    } catch (e) {
      console.warn("Seek error:", e);
    }

    setState((s) => ({
      ...s,
      currentTime: clampedTime,
      duration: actualDur > 0 ? actualDur : s.duration,
    }));
  }, [state.duration]);

  const seekRelative = useCallback((seconds: number) => {
    const media = mediaRef.current;
    if (!media) return;
    const current = media.currentTime || state.currentTime || 0;
    seek(current + seconds);
  }, [seek, state.currentTime]);

  const seekByRatio = useCallback((ratio: number) => {
    const media = mediaRef.current;
    if (!media) return;

    let dur = 0;
    if (isFinite(media.duration) && media.duration > 0) {
      dur = media.duration;
    } else if (media.seekable && media.seekable.length > 0) {
      dur = media.seekable.end(media.seekable.length - 1);
    } else if (state.duration > 0) {
      dur = state.duration;
    }

    if (dur > 0) {
      seek(ratio * dur);
    }
  }, [seek, state.duration]);

  const setVolume = useCallback((vol: number) => {
    const media = mediaRef.current;
    if (!media) return;
    const v = Math.max(0, Math.min(1, vol));
    media.volume = v;
    media.muted = v === 0;
    setState((s) => ({ ...s, volume: v, isMuted: v === 0 }));
  }, []);

  const toggleMute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.muted = !media.muted;
    setState((s) => ({ ...s, isMuted: media.muted }));
  }, []);

  const cycleSpeed = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    const speeds = [1.0, 1.25, 1.5, 2.0, 0.5, 0.75];
    const next = speeds[(speeds.indexOf(state.playbackRate) + 1) % speeds.length];
    media.playbackRate = next;
    setState((s) => ({ ...s, playbackRate: next }));
  }, [state.playbackRate]);

  const toggleFullscreen = useCallback((elem: HTMLElement | null) => {
    if (!elem) return;
    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const media = mediaRef.current;
    if (!media || currentTrack?.type !== "video") return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setState((s) => ({ ...s, isPiP: false }));
      } else {
        await media.requestPictureInPicture();
        setState((s) => ({ ...s, isPiP: true }));
      }
    } catch {}
  }, [currentTrack]);

  const captureSnapshot = useCallback(() => {
    const media = mediaRef.current;
    if (!media || currentTrack?.type !== "video") return;
    const canvas = document.createElement("canvas");
    canvas.width = media.videoWidth || 1920;
    canvas.height = media.videoHeight || 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(media, 0, 0, canvas.width, canvas.height);
    const link = document.createElement("a");
    link.download = "PlayIT_Snapshot_" + currentTrack.title + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [currentTrack]);

  const toggleFavorite = useCallback((id: string) => {
    setPlaylist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
  }, []);

  const updateEqBand = useCallback((idx: number, gain: number) => {
    setEqBands((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], gain };
      return updated;
    });
  }, []);

  const addFilesToIngest = useCallback((files: FileList | File[]) => {
    setUploadError(null);
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      if (file.size > MAX_USER_FILE_SIZE_BYTES) {
        const sizeInGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
        setUploadError('"' + file.name + '" is ' + sizeInGB + ' GB. The maximum allowed file size is 6.0 GB.');
        return;
      }

      const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mkv|mov|avi)$/i.test(file.name);
      const ext = file.name.split(".").pop()?.toUpperCase() || (isVideo ? "MP4" : "FLAC");
      const itemId = Math.random().toString(36).substring(2, 9);
      const blobUrl = URL.createObjectURL(file);

      const newIngest: IngestItem = {
        id: itemId,
        name: file.name.replace(/\.[^/.]+$/, ""),
        size: file.size,
        uploadedBytes: 0,
        type: isVideo ? "video" : "audio",
        format: ext,
        sampleRate: isVideo ? "48kHz" : "192kHz",
        bitDepth: "24-bit",
        progress: 0,
        speedMBps: 45.0,
        elapsedSeconds: 0,
        etaSeconds: 10,
        status: "uploading",
        file,
        url: blobUrl,
      };

      setIngestQueue((prev) => [newIngest, ...prev]);

      const startTime = Date.now();
      let currentProgress = 0;

      const timer = setInterval(() => {
        const elapsedSec = (Date.now() - startTime) / 1000;
        currentProgress += Math.floor(Math.random() * 8) + 6;

        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(timer);

          setIngestQueue((q) =>
            q.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    progress: 100,
                    uploadedBytes: file.size,
                    speedMBps: 0,
                    elapsedSeconds: Math.round(elapsedSec),
                    etaSeconds: 0,
                    status: "ready",
                  }
                : i
            )
          );

          const newMedia: MediaItem = {
            id: itemId,
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Local Ingest",
            url: blobUrl,
            type: isVideo ? "video" : "audio",
            format: ext,
            sampleRate: isVideo ? "48kHz" : "192kHz",
            size: file.size,
            duration: 0,
          };

          setPlaylist((prev) => [newMedia, ...prev.filter((p) => p.id !== itemId)]);
          setCurrentIndex((curr) => (curr === -1 ? 0 : curr));
        } else {
          const uploadedBytes = Math.round((currentProgress / 100) * file.size);
          const remainingBytes = file.size - uploadedBytes;
          const currentSpeedMBps = Math.max(15, Math.round(((uploadedBytes / (elapsedSec || 1)) / (1024 * 1024)) * 10) / 10);
          const bytesPerSec = currentSpeedMBps * 1024 * 1024;
          const etaSec = Math.max(1, Math.round(remainingBytes / bytesPerSec));

          setIngestQueue((q) =>
            q.map((i) =>
              i.id === itemId
                ? {
                    ...i,
                    progress: currentProgress,
                    uploadedBytes,
                    speedMBps: currentSpeedMBps,
                    elapsedSeconds: Math.round(elapsedSec),
                    etaSeconds: etaSec,
                  }
                : i
            )
          );
        }
      }, 250);
    });
  }, []);

  return {
    mediaRef,
    analyserNode: analyserRef.current,
    playlist,
    setPlaylist,
    currentIndex,
    setCurrentIndex,
    currentTrack,
    ingestQueue,
    history,
    state,
    setState,
    eqBands,
    updateEqBand,
    uploadError,
    setUploadError,
    togglePlay,
    seek,
    seekRelative,
    seekByRatio,
    setVolume,
    toggleMute,
    cycleSpeed,
    toggleFullscreen,
    togglePiP,
    captureSnapshot,
    playNext,
    playPrevious,
    toggleFavorite,
    addFilesToIngest,
    handleTimeUpdate,
    handleLoadedMetadata,
    handlePlay,
    handlePause,
    handleEnded,
    handleProgress,
  };
}
