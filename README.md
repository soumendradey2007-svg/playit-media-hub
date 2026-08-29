# 🎬 PlayIT — Ultra-HD Media Player & Ingest Studio

A high-performance, warm-minimalist media streaming workstation built with **Next.js 14 (App Router)**, **React 18**, **TypeScript (Strict Mode)**, and **Tailwind CSS**. 

PlayIT leverages **client-side zero-copy memory virtualization** and **hardware-accelerated HTML5 decoding** to process multi-gigabyte (up to 6.0 GB) 4K video and studio audio files directly in the browser with **zero server bandwidth**, **zero latency**, and **zero cloud storage overhead**.

---

## 🏛️ System Architecture & Engineering

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                 │
├───────────────────────────────┬─────────────────────────────────────────────┤
│  Local Media Ingest (≤ 6 GB)  │   Internet Stream URL (Direct Web Stream)   │
└───────────────┬───────────────┴───────────────────────┬─────────────────────┘
                │                                       │
                ▼                                       ▼
┌───────────────────────────────┐       ┌─────────────────────────────────────┐
│  URL.createObjectURL Engine   │       │  CORS-Compliant Video Source Buffer │
│  (Zero-Copy Disk Virtualizer) │       └──────────────────┬──────────────────┘
└───────────────┬───────────────┘                          │
                │                                          │
                └───────────────────┬──────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HTML5 Hardware Media Pipeline                         │
│  ┌─────────────────────────┐               ┌─────────────────────────────┐  │
│  │ 4K Video Decoder (GPU)  │               │ Audio Processing Channel    │  │
│  └────────────┬────────────┘               └──────────────┬──────────────┘  │
│               │                                           │                 │
│               ▼                                           ▼                 │
│  ┌─────────────────────────┐               ┌─────────────────────────────┐  │
│  │  16:9 Viewport + Native │               │ Web Audio API AnalyserNode  │  │
│  │   Pointer Capture Layer │               │ + 9-Band BiquadFilter Nodes │  │
│  └─────────────────────────┘               └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ⚡ Core Technical Capabilities

### 1. Zero-Copy Client Stream Engine
- **Memory Footprint Protection**: Instead of reading multi-gigabyte files into JavaScript heap via `FileReader.readAsArrayBuffer()` (which exhausts V8 heap memory and crashes the browser tab), PlayIT utilizes `URL.createObjectURL(file)` to establish a direct kernel-level disk pointer to the media decoder.
- **6.0 GB Ingest Guardrail with 1.0 GB System Buffer**: Enforces a strict 6.0 GB user file limit with a 1.0 GB hardware headroom buffer (`MAX_USER_FILE_SIZE_BYTES = 6 * 1024 * 1024 * 1024`), preventing system swap exhaustion during high-bitrate 4K 60fps rendering.

### 2. Live Ingest Telemetry & Real-Time Math
- **Transfer Rate Metric**: Dynamically calculates bandwidth in megabytes per second:
  $$\text{Speed (MB/s)} = \frac{\text{Uploaded Bytes}}{\Delta t \times 1024 \times 1024}$$
- **ETA Countdown Engine**: Computes estimated time remaining based on remaining byte volume:
  $$\text{ETA (seconds)} = \frac{\text{Total Bytes} - \text{Uploaded Bytes}}{\text{Current Byte Rate}}$$

### 3. Bulletproof Fullscreen Controller & Pointer Capture
- **Native Event Trapping**: Solves Chromium's fullscreen pointer swallowing by layering an absolute transparent capture overlay (`z-index: 20`) above the `<video>` element.
- **Bottom-Zone Protection**: Decoupled activity loop automatically locks controls visible when the cursor coordinates sit within the lower 30% of the viewport.
- **4.5s Decay Timer**: Gently transitions cursor and control bar to `opacity: 0; cursor: none;` after 4.5 seconds of center-screen inactivity during active playback.

### 4. Hardware-Accelerated Seeking & Duration Resolution
- **Asynchronous Duration Extraction**: Multi-gigabyte containers often return `duration: Infinity` or `NaN` initially. PlayIT implements a hierarchical duration fallback:
  ```typescript
  const dur = (isFinite(media.duration) && media.duration > 0)
    ? media.duration
    : (media.seekable?.length ? media.seekable.end(media.seekable.length - 1) : fallbackDuration);
  ```
- **Instant Scrubber Sync**: Direct ratio-based seeking (`seekByRatio(pos)`) updates the CSS progress matrix and hardware timestamp in the exact same render frame, eliminating timeline reset glitches.

### 5. Web Audio API 9-Band Equalizer & Visualizer
- **BiquadFilterNode Matrix**: Real-time frequency shaping across 9 bands (60Hz, 170Hz, 310Hz, 600Hz, 1kHz, 3kHz, 6kHz, 12kHz, 14kHz).
- **Fast Fourier Transform (FFT)**: `AnalyserNode` frequency spectrum extraction rendered dynamically on HTML5 Canvas for lossless audio formats (.FLAC, .WAV).

---

## 🎨 Sahara Design System Tokens

The interface is built using a custom warm-minimalist design system:

| Token Name | Light Mode (Warm Linen) | Dark Mode (Sahara Obsidian) | Purpose |
| :--- | :--- | :--- | :--- |
| **`--primary`** | `#c2652a` (Burnt Sienna) | `#e07a3c` | Primary CTA, Scrubber, Active States |
| **`--surface`** | `#fdfaf7` (Warm Linen) | `#141211` (Obsidian) | Root Viewport Background |
| **`--surface-bright`**| `#ffffff` | `#1e1a17` | Card Containers & Player Island |
| **`--outline`** | `#e5e0db` | `#332d28` | Border Rules & Inactive Dividers |
| **`--text-header`** | `#1a1a1a` | `#f5f0eb` | Serif Typography & Headings |
| **`--tertiary`** | `#8c3c3c` (Dusty Rose) | `#c46262` | Error Bounds & Destructive Alerts |

---

## 📁 Repository Structure

```
playit-media-hub/
├── app/
│   ├── globals.css          # Sahara CSS variables, custom range sliders & animations
│   ├── layout.tsx           # Font optimization (EB Garamond + Manrope) & metadata
│   └── page.tsx             # Root orchestrator (Views, Keybindings, Theme state)
├── components/
│   ├── layout/
│   │   ├── SideNav.tsx      # Fixed 256px Sahara navigation drawer
│   │   └── TopNav.tsx       # Sticky 72px bar with search, EQ trigger & theme toggle
│   ├── modals/
│   │   ├── EqualizerModal.tsx # 9-Band Web Audio API frequency sculpting modal
│   │   └── ShortcutsModal.tsx # Interactive keyboard shortcut guide
│   ├── player/
│   │   ├── AudioVisualizer.tsx # Canvas FFT spectrum analyzer
│   │   ├── Controls.tsx     # Scrubber seekbar, 10s skip cluster & format metrics
│   │   ├── PlayerViewport.tsx # 16:9 Viewport, pointer capture & fullscreen loop
│   │   └── RecentUploads.tsx  # Ingested track library & favorite toggling
│   └── upload/
│       ├── DropZone.tsx     # Drag & drop file card + Internet URL streamer
│       └── IngestQueue.tsx  # Live MB/s speed, elapsed timer & ETA table
├── hooks/
│   └── useMediaPlayer.ts    # Central player state machine & hardware audio/video sync
├── types/
│   └── player.ts            # Core TypeScript interfaces for Ingest & Playback models
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

---

## ⌨️ Global Keybindings

| Key | Function | Event Mechanism |
| :--- | :--- | :--- |
| **`Space`** | Play / Pause | Intercepts default scrolling and calls `togglePlay()` |
| **`J` / `ArrowLeft`** | Rewind 10s / 5s | Direct hardware timestamp decrement via `seekRelative(-10)` |
| **`L` / `ArrowRight`** | Forward 10s / 5s | Direct hardware timestamp increment via `seekRelative(10)` |
| **`F`** | Fullscreen Toggle | `element.requestFullscreen()` with capture-phase fallback |
| **`M`** | Mute Audio | Toggles `media.muted` property |
| **`S`** | Snapshot Capture | Renders current frame to offscreen 2D Canvas and triggers PNG download |

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.17.0 or higher
- **Package Manager**: `npm`, `yarn`, or `pnpm`

```bash
# 1. Clone repository
git clone https://github.com/soumendradey2007-svg/playit-media-hub.git

# 2. Navigate to project root
cd playit-media-hub

# 3. Install dependencies
npm install

# 4. Launch Next.js local development server
npm run dev
```
Open **http://localhost:3000** in your browser.

---

## ☁️ Deployment (Vercel Global Edge)

PlayIT is optimized for instant deployment on the **Vercel Serverless & Edge Network**:

1. Link your GitHub repository in **[Vercel Dashboard](https://vercel.com/dashboard)**.
2. Select **Framework Preset**: `Next.js`.
3. Click **Deploy**. Vercel will automatically build the Next.js App Router tree and publish your global production URL with automated CI/CD on every `git push`.

---

## 📄 License
MIT © 2026 PlayIT Media Hub. Open-source and free for personal and commercial use.
