"use client";

import React, { useState, useRef } from "react";
import { CloudUpload, ShieldCheck, Link2, ArrowRight } from "lucide-react";

interface DropZoneProps {
  onFilesDropped: (files: FileList | File[]) => void;
  onAddRemoteUrl?: (url: string, name?: string) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped, onAddRemoteUrl }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [webUrl, setWebUrl] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webUrl.trim()) return;
    if (onAddRemoteUrl) {
      onAddRemoteUrl(webUrl.trim());
      setWebUrl("");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          if (e.dataTransfer.files) onFilesDropped(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={"w-full p-8 sm:p-10 rounded-large border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3.5 bg-surface-bright " + (
          isDragOver
            ? "border-primary bg-primary/[0.03] scale-[1.005]"
            : "border-outline hover:border-primary/60 shadow-sahara"
        )}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => e.target.files && onFilesDropped(e.target.files)}
          multiple
          accept="video/*,audio/*"
          className="hidden"
        />

        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <CloudUpload className="w-8 h-8" />
        </div>

        <div className="flex flex-col items-center gap-1">
          <h3 className="font-serif text-2xl font-bold text-text-header">
            Drop device files here or click to upload
          </h3>
          <p className="text-xs text-text-muted max-w-md">
            Zero-copy client hardware decoding • Supports 4K Video (.MP4, .MKV, .WEBM) and Studio Audio (.FLAC, .WAV, .MP3)
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-dim border border-outline text-[11px] font-semibold text-text-body">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Max File Size: <strong>6.0 GB</strong> (Zero Bandwidth Cost on Vercel)</span>
        </div>
      </div>

      <form
        onSubmit={handleUrlSubmit}
        className="sahara-card p-4 flex flex-col sm:flex-row items-center gap-3"
      >
        <div className="flex items-center gap-2.5 text-text-muted shrink-0">
          <Link2 className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-text-header">Stream from Internet URL:</span>
        </div>

        <input
          type="url"
          placeholder="https://example.com/video.mp4 or online audio stream..."
          value={webUrl}
          onChange={(e) => setWebUrl(e.target.value)}
          className="flex-1 w-full px-3.5 py-2 text-xs bg-surface-dim border border-outline rounded-standard focus:outline-none focus:border-primary text-text-header placeholder:text-text-muted font-mono"
        />

        <button
          type="submit"
          disabled={!webUrl.trim()}
          className="w-full sm:w-auto px-4 py-2 rounded-standard bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <span>Stream Online</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
