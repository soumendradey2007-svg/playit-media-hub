"use client";

import React, { useState, useRef } from "react";
import { CloudUpload } from "lucide-react";

interface DropZoneProps {
  onFilesDropped: (files: FileList) => void;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
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
      className={`w-full p-10 rounded-large border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-3 bg-surface-bright ${
        isDragOver
          ? "border-primary bg-primary/[0.03] scale-[1.005]"
          : "border-outline hover:border-primary/60 shadow-sahara"
      }`}
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

      <div>
        <h3 className="font-serif text-2xl font-bold text-text-header">
          Drop files here or click to upload
        </h3>
        <p className="text-xs text-text-muted mt-1 max-w-sm">
          Supports Ultra-HD Videos (.MP4, .MKV, .WEBM) and Studio Master Audio (.FLAC, .WAV, .MP3, .OGG)
        </p>
      </div>
    </div>
  );
};
