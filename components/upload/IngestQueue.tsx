"use client";

import React from "react";
import { IngestItem } from "@/types/player";
import { Film, Music, CheckCircle2, Play, Activity, Clock, Timer } from "lucide-react";

interface IngestQueueProps {
  items: IngestItem[];
  onPlayItem?: (id: string) => void;
}

export const IngestQueue: React.FC<IngestQueueProps> = ({ items, onPlayItem }) => {
  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  };

  return (
    <div className="sahara-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-outline pb-3">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-xl font-bold text-text-header">Ingest Pipeline & Upload Monitor</h2>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-outline font-mono font-bold text-text-body">
            {items.length} {items.length === 1 ? "File" : "Files"}
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="py-10 text-center text-xs text-text-muted">
          No files currently in ingest pipeline. Drop video or audio files above to start.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-outline text-text-muted uppercase tracking-wider font-semibold">
                <th className="pb-3">File Name</th>
                <th className="pb-3">Transferred / Total</th>
                <th className="pb-3">Upload Speed</th>
                <th className="pb-3">Timers (Elapsed / ETA)</th>
                <th className="pb-3">Progress</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/40 font-medium">
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`transition-colors ${item.status === "ready" ? "bg-success/[0.04] hover:bg-success/[0.08]" : "hover:bg-surface-dim"}`}
                >
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-standard bg-outline/60 flex items-center justify-center text-text-body shrink-0">
                      {item.type === "video" ? <Film className="w-4 h-4" /> : <Music className="w-4 h-4" />}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="font-semibold text-text-header truncate max-w-xs">{item.name}</span>
                      <span className="text-[10px] font-mono text-text-muted">{item.format}</span>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-text-header whitespace-nowrap">
                    {item.status === "ready" ? (
                      <span>{formatBytes(item.size)}</span>
                    ) : (
                      <span>{formatBytes(item.uploadedBytes || 0)} <span className="text-text-muted">/ {formatBytes(item.size)}</span></span>
                    )}
                  </td>
                  <td className="py-4 font-mono whitespace-nowrap">
                    {item.status === "ready" ? (
                      <span className="text-text-muted">Completed</span>
                    ) : (
                      <span className="text-primary font-bold inline-flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        {item.speedMBps} MB/s
                      </span>
                    )}
                  </td>
                  <td className="py-4 font-mono text-xs whitespace-nowrap">
                    {item.status === "ready" ? (
                      <span className="text-text-muted inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-success" />
                        Took {formatTimer(item.elapsedSeconds)}
                      </span>
                    ) : (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-text-body inline-flex items-center gap-1">
                          <Timer className="w-3 h-3 text-primary" />
                          Elapsed: {formatTimer(item.elapsedSeconds)}
                        </span>
                        <span className="text-[11px] text-text-muted">ETA: {formatTimer(item.etaSeconds)} left</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4">
                    {item.status === "ready" ? (
                      <div className="flex items-center gap-1.5 text-success font-semibold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ready (100%)</span>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1 w-28 sm:w-36">
                        <div className="flex justify-between text-[11px] font-mono font-bold text-primary">
                          <span>Ingesting</span>
                          <span>{item.progress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-outline rounded-full overflow-hidden">
                          <div className="h-full bg-primary transition-all duration-200" style={{ width: `${item.progress}%` }} />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    {item.status === "ready" && onPlayItem && (
                      <button
                        onClick={() => onPlayItem(item.id)}
                        className="px-3.5 py-1.5 rounded-standard bg-primary hover:bg-primary-hover text-white text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm transition-all hover:scale-105 active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Play Now</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};