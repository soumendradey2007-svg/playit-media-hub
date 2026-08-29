"use client";
import React, { useRef } from "react";
import { Search, Cloud, Sliders, Keyboard, User, Menu, Moon, Sun } from "lucide-react";
interface TopNavProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenUploadStudio: () => void;
  onOpenEqualizer: () => void;
  onOpenShortcuts: () => void;
  onUploadNative: (files: FileList) => void;
  onMobileMenuToggle?: () => void;
}
export const TopNav: React.FC<TopNavProps> = ({
  isDarkMode,
  onToggleTheme,
  onOpenUploadStudio,
  onOpenEqualizer,
  onOpenShortcuts,
  onUploadNative,
  onMobileMenuToggle,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <header className="h-[72px] sticky top-0 bg-surface/90 backdrop-blur-md border-b border-outline px-6 flex items-center justify-between z-20 transition-colors">
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onMobileMenuToggle}
          className="p-2 rounded-standard border border-outline md:hidden text-text-body"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search audio, video, or artists..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-surface-bright border border-outline rounded-standard focus:outline-none focus:border-primary text-text-header placeholder:text-text-muted transition-colors shadow-sahara"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files && onUploadNative(e.target.files)}
          multiple
          accept="video/*,audio/*"
          className="hidden"
        />
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="p-2 rounded-standard bg-surface-bright hover:bg-surface-dim border border-outline text-text-body hover:text-primary transition-all shadow-sahara"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>
        <button
          onClick={onOpenUploadStudio}
          className="flex items-center gap-1.5 px-3 py-2 rounded-standard bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-all shadow-sahara"
        >
          <Cloud className="w-4 h-4" />
          <span className="hidden sm:inline">Upload Studio</span>
        </button>
        <button
          onClick={onOpenEqualizer}
          title="Sahara Graphic Equalizer"
          className="p-2 rounded-standard bg-surface-bright hover:bg-surface-dim border border-outline text-text-body hover:text-text-header transition-all shadow-sahara"
        >
          <Sliders className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts"
          className="p-2 rounded-standard bg-surface-bright hover:bg-surface-dim border border-outline text-text-body hover:text-text-header transition-all shadow-sahara hidden sm:flex"
        >
          <Keyboard className="w-4 h-4" />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary font-bold text-xs shadow-sahara ml-1 cursor-pointer">
          <User className="w-4 h-4" />
        </div>
      </div>
    </header>
  );
};