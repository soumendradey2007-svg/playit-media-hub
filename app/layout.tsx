import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayIT — Ultra-HD 4K Video Player & Studio Audio Hub",
  description: "High-performance warm-minimalist web media hub built for zero-copy 4K video playback and lossless audio streaming up to 6.0 GB.",
  keywords: ["online video player", "4k media player", "flac audio player", "playit media hub", "browser video player"],
  openGraph: {
    title: "PlayIT — Ultra-HD 4K Video Player & Studio Audio Hub",
    description: "Zero-copy hardware-accelerated 4K media player supporting up to 6.0 GB video files.",
    url: "https://playit-media-hub.vercel.app",
    siteName: "PlayIT Media Hub",
    type: "website",
  },
  verification: {
    google: "9df51a9d2753c7cb",
  },
};

export default function RootLayout({
  children,
}: Readonl<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-primary/20 selection:text-primary">
        {children}
      </body>
    </html>
  );
}
