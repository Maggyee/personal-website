"use client";

import { useEffect, useRef } from "react";

type PointerGlowProps = {
  children: React.ReactNode;
  className?: string;
};

export function PointerGlow({ children, className = "" }: PointerGlowProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const glow = stage.querySelector<HTMLElement>("[data-pointer-glow]");
    if (!glow) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let enabled = false;
    let active = false;
    let frame = 0;
    let lastFrameTime = 0;
    let bounds = stage.getBoundingClientRect();
    const target = { x: bounds.width * 0.72, y: bounds.height * 0.36 };
    const current = { ...target };

    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastFrameTime = 0;
    };

    const resetVisuals = () => {
      stop();
      active = false;
      stage.classList.remove("is-pointer-active");
      glow.removeAttribute("style");
    };

    const applyPosition = () => {
      glow.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate3d(-50%, -50%, 0)`;
    };

    const tick = (time: number) => {
      const delta = lastFrameTime
        ? Math.min((time - lastFrameTime) / 1000, 0.05)
        : 1 / 60;
      lastFrameTime = time;

      const ease = 1 - Math.exp(-20 * delta);

      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      applyPosition();

      const isMoving =
        Math.abs(target.x - current.x) > 0.2 ||
        Math.abs(target.y - current.y) > 0.2;

      if (isMoving) {
        frame = window.requestAnimationFrame(tick);
      } else {
        current.x = target.x;
        current.y = target.y;
        applyPosition();
        frame = 0;
        lastFrameTime = 0;
      }
    };

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const updateBounds = () => {
      bounds = stage.getBoundingClientRect();
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (!enabled) return;
      updateBounds();
      active = true;
      stage.classList.add("is-pointer-active");
      target.x = event.clientX - bounds.left;
      target.y = event.clientY - bounds.top;
      current.x = target.x;
      current.y = target.y;
      applyPosition();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled || !active) return;
      target.x = Math.min(bounds.width, Math.max(0, event.clientX - bounds.left));
      target.y = Math.min(bounds.height, Math.max(0, event.clientY - bounds.top));
      start();
    };

    const onPointerLeave = () => {
      active = false;
      stage.classList.remove("is-pointer-active");
      start();
    };

    const updateCapabilities = () => {
      enabled = finePointer.matches && !reduceMotion.matches;
      stage.dataset.pointerEnabled = String(enabled);
      if (!enabled) resetVisuals();
    };

    updateCapabilities();
    stage.addEventListener("pointerenter", onPointerEnter);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerleave", onPointerLeave);
    stage.addEventListener("pointercancel", onPointerLeave);
    window.addEventListener("resize", updateBounds, { passive: true });
    reduceMotion.addEventListener("change", updateCapabilities);
    finePointer.addEventListener("change", updateCapabilities);

    return () => {
      stop();
      stage.removeEventListener("pointerenter", onPointerEnter);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerleave", onPointerLeave);
      stage.removeEventListener("pointercancel", onPointerLeave);
      window.removeEventListener("resize", updateBounds);
      reduceMotion.removeEventListener("change", updateCapabilities);
      finePointer.removeEventListener("change", updateCapabilities);
    };
  }, []);

  return (
    <div ref={stageRef} className={className}>
      <div
        data-pointer-glow
        className="about-pointer-glow pointer-events-none absolute left-0 top-0"
        aria-hidden
      />
      {children}
    </div>
  );
}
