"use client";

import React from "react";
import {
  PlaySquare,
  Home,
  ListMusic,
  History,
  Heart,
  Upload,
  Sparkles,
} from "lucide-react";

interface SideNavProps {
  currentView: "dashboard" | "upload" | "queue" | "history" | "favorites";
  onViewChange: (view: "dashboard" | "upload" | "queue" | "history" | "favorites") => void;
  onUploadClick: () => void;
  playlistCount: number;
}

export const SideNav: React.FC<SideNavProps> = ({
  currentView,
  onViewChange,
  onUploadClick,
  playlistCount,
}) => {
  const navItems = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "queue", label: "Queue", icon: ListMusic, badge: playlistCount },
    { id: "history", label: "History", icon: History },
    { id: "favorites", label: "Favorites", icon: Heart },
  ];

  return (
    <aside className="w-64 fixed left-0 top-0 bottom-0 bg-surface-dim border-r border-outline flex flex-col justify-between p-6 z-30 select-none hidden md:flex">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onViewChange("dashboard")}>
          <div className="w-10 h-10 rounded-standard bg-primary flex items-center justify-center text-white shadow-sahara-lg">
            <PlaySquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-text-header tracking-tight">PlayIT</h1>
            <p className="text-[11px] font-medium text-text-muted tracking-wide uppercase">Media Hub</p>
          </div>
        </div>

        <button
          onClick={onUploadClick}
          className="w-full py-2.5 px-4 rounded-standard border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 shadow-sahara"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Files</span>
        </button>

        <nav className="flex flex-col gap-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id as typeof currentView)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-standard text-sm font-medium transition-all ${
                  isActive
                    ? "bg-nav-active text-primary font-semibold shadow-sm"
                    : "text-text-body hover:bg-black/[0.03] hover:text-text-header"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-text-muted"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-outline/60 text-text-body font-mono font-semibold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-outline/70 text-xs text-text-muted">
        <button
          onClick={() => onViewChange("upload")}
          className={`flex items-center gap-3 px-3 py-2 rounded-standard transition-colors ${
            currentView === "upload" ? "bg-nav-active text-primary font-semibold" : "hover:text-text-header"
          }`}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Upload Studio</span>
        </button>
        <div className="flex items-center justify-between px-3 py-1">
          <span className="text-[11px] uppercase tracking-wider font-semibold">Sahara UI</span>
          <span className="w-2 h-2 rounded-full bg-success"></span>
        </div>
      </div>
    </aside>
  );
};
