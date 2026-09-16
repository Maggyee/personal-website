"use client";

import { useEffect, useRef, useState } from "react";

export function HeroVideo() {
  const [ready, setReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const allowMotion = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    let visible = true;

    const syncPlayback = () => {
      if (visible && allowMotion.matches && !document.hidden) {
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.01 },
    );

    observer.observe(video);
    allowMotion.addEventListener("change", syncPlayback);
    document.addEventListener("visibilitychange", syncPlayback);

    return () => {
      observer.disconnect();
      allowMotion.removeEventListener("change", syncPlayback);
      document.removeEventListener("visibilitychange", syncPlayback);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className={`hero-video h-full w-full object-cover ${ready ? "is-ready" : ""}`}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
      onError={() => setReady(false)}
    >
      <source
        src="/media/hero-bg.webm"
        type="video/webm"
        media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
      />
      <source
        src="/media/hero-bg.mp4"
        type="video/mp4"
        media="(min-width: 768px) and (prefers-reduced-motion: no-preference)"
      />
      <source
        src="/media/hero-bg-mobile.webm"
        type="video/webm"
        media="(max-width: 767px) and (prefers-reduced-motion: no-preference)"
      />
      <source
        src="/media/hero-bg-mobile.mp4"
        type="video/mp4"
        media="(max-width: 767px) and (prefers-reduced-motion: no-preference)"
      />
    </video>
  );
}
