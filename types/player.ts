export interface IngestItem {
  id: string;
  name: string;
  size: number;
  uploadedBytes: number;
  type: "video" | "audio";
  format: string;
  sampleRate?: string;
  bitDepth?: string;
  progress: number;
  speedMBps: number;
  elapsedSeconds: number;
  etaSeconds: number;
  status: "pending" | "uploading" | "ready" | "error";
  file?: File;
  url?: string;
  duration?: number;
  artist?: string;
}

export interface MediaItem {
  id: string;
  title: string;
  artist: string;
  url: string;
  type: "video" | "audio";
  format: string;
  sampleRate?: string;
  size: number;
  duration: number;
  thumbnail?: string;
  isFavorite?: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  buffered: number;
  isFullscreen: boolean;
  isPiP: boolean;
  isShuffle: boolean;
  loop: "none" | "one" | "all";
}

export interface EqualizerBand {
  frequency: number;
  gain: number;
  type: BiquadFilterType;
}