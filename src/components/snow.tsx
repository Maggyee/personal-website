"use client";

import { useEffect, useRef } from "react";
import { THEME_CHANGE_EVENT } from "@/lib/theme";

type Flake = {
  x: number;
  y: number;
  r: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  depth: number;
  // Burst flakes fall once and are not respawned.
  burst: boolean;
};

const SPRITE_SIZE = 64;

function makeSprite(soft: boolean, day: boolean) {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = SPRITE_SIZE;
  const ctx = sprite.getContext("2d")!;
  const half = SPRITE_SIZE / 2;
  const gradient = ctx.createRadialGradient(half, half, 0, half, half, half);
  gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
  gradient.addColorStop(soft ? 0.25 : 0.45, "rgba(255, 255, 255, 0.92)");
  // On the bright day scene a faint blue rim keeps white flakes visible.
  gradient.addColorStop(soft ? 0.7 : 0.8, day ? "rgba(150, 180, 230, 0.55)" : "rgba(255, 255, 255, 0.28)");
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(half, half, half, 0, Math.PI * 2);
  ctx.fill();
  return sprite;
}

export function Snow({ layer }: { layer: "back" | "front" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const front = layer === "front";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const isDay = () => document.documentElement.dataset.theme === "ice";
    let sprite = makeSprite(front, isDay());

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let frame = 0;
    let lastTime = 0;
    let onScreen = true;
    let wind = 0;
    let gust = 0;
    let lastPointerX: number | null = null;

    const targetCount = () => {
      if (front) return Math.max(4, Math.round(width / 160));
      return Math.min(170, Math.max(45, Math.round((width * height) / 8500)));
    };

    const createFlake = (fromTop: boolean, burst = false): Flake => {
      const depth = Math.random();
      const r = front ? 5 + depth * 9 : 0.7 + depth * 2.4;
      return {
        x: Math.random() * width,
        y: fromTop ? -r - Math.random() * height * (burst ? 0.6 : 0.15) : Math.random() * height,
        r,
        speed: front ? 70 + depth * 70 : 18 + depth * 52,
        sway: 0.4 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        alpha: front ? 0.28 + depth * 0.3 : 0.35 + depth * 0.6,
        depth,
        burst,
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = targetCount();
      const steady = flakes.filter((flake) => !flake.burst);
      while (steady.length < count) steady.push(createFlake(false));
      flakes = steady.slice(0, count);
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const flake of flakes) {
        ctx.globalAlpha = flake.alpha;
        ctx.drawImage(sprite, flake.x - flake.r, flake.y - flake.r, flake.r * 2, flake.r * 2);
      }
      ctx.globalAlpha = 1;
    };

    const tick = (time: number) => {
      const dt = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;

      // A slow breeze plus gusts from pointer movement and theme changes.
      const breeze = Math.sin(time / 5200) * 14 + 6;
      gust *= Math.pow(0.35, dt);
      wind += (breeze + gust - wind) * Math.min(1, dt * 2.5);

      for (let i = flakes.length - 1; i >= 0; i -= 1) {
        const flake = flakes[i];
        flake.phase += dt * flake.sway;
        flake.x += (wind * (0.35 + flake.depth) + Math.sin(flake.phase) * 12 * flake.sway) * dt;
        flake.y += flake.speed * dt;

        if (flake.y - flake.r > height) {
          if (flake.burst) {
            flakes.splice(i, 1);
            continue;
          }
          Object.assign(flake, createFlake(true), { y: -flake.r });
        }
        if (flake.x > width + flake.r) flake.x = -flake.r;
        if (flake.x < -flake.r) flake.x = width + flake.r;
      }

      draw();
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame || reduceMotion.matches || !onScreen || document.hidden) return;
      lastTime = 0;
      frame = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    };

    const sync = () => {
      if (reduceMotion.matches) {
        stop();
        ctx.clearRect(0, 0, width, height);
      } else if (onScreen && !document.hidden) {
        start();
      } else {
        stop();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (lastPointerX !== null) {
        gust = Math.max(-140, Math.min(140, gust + (event.clientX - lastPointerX) * 0.9));
      }
      lastPointerX = event.clientX;
    };

    const onThemeChange = () => {
      sprite = makeSprite(front, isDay());
      if (reduceMotion.matches) return;
      gust = (Math.random() > 0.5 ? 1 : -1) * 150;
      const extra = front ? 6 : 70;
      for (let i = 0; i < extra; i += 1) flakes.push(createFlake(true, true));
    };

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    const resizeObserver = new ResizeObserver(resize);

    resize();
    observer.observe(canvas);
    resizeObserver.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", sync);
    sync();

    return () => {
      stop();
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", sync);
    };
  }, [layer]);

  return <canvas ref={canvasRef} className={`snow-canvas snow-${layer}`} aria-hidden />;
}
