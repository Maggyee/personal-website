"use client";

import { useEffect } from "react";

export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hero = document.getElementById("hero");
    const background = document.querySelector<HTMLElement>(".hero-scroll-bg");
    const copy = document.querySelector<HTMLElement>(".hero-scroll-copy");
    const art = document.querySelector<HTMLElement>(".hero-scroll-art");
    const atmosphere = document.querySelector<HTMLElement>(
      ".hero-scroll-atmosphere",
    );
    const cue = document.querySelector<HTMLElement>(".hero-scroll-cue");
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-motion"),
    );

    let revealObserver: IntersectionObserver | null = null;
    let frame = 0;
    let lastProgress = -1;

    const clearHeroStyles = () => {
      for (const node of [background, copy, art, atmosphere, cue]) {
        node?.removeAttribute("style");
      }
      lastProgress = -1;
    };

    const measureHero = () => {
      frame = 0;
      if (reduceMotion.matches || !hero) return;

      const range = Math.max(hero.offsetHeight, 1);
      const progress = Math.min(1, Math.max(0, window.scrollY / range));
      if (Math.abs(progress - lastProgress) < 0.001) return;
      lastProgress = progress;

      if (background) {
        background.style.transform = `translate3d(0, ${progress * 42}px, 0) scale(1.04)`;
      }
      if (copy) {
        copy.style.transform = `translate3d(0, ${progress * -18}px, 0)`;
        copy.style.opacity = String(1 - progress * 0.28);
      }
      if (art) {
        art.style.transform = `translate3d(0, ${progress * 28}px, 0)`;
        art.style.opacity = String(1 - progress * 0.18);
      }
      if (atmosphere) {
        atmosphere.style.transform = `translate3d(0, ${progress * -8}px, 0)`;
        atmosphere.style.opacity = String(0.52 - progress * 0.1);
      }
      if (cue) {
        cue.style.opacity = String(Math.max(0, 1 - progress / 0.36));
      }
    };

    const scheduleHero = () => {
      if (!frame && !reduceMotion.matches) {
        frame = window.requestAnimationFrame(measureHero);
      }
    };

    const enableReveals = () => {
      if (reduceMotion.matches || revealObserver) return;

      revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            (entry.target as HTMLElement).classList.add("is-visible");
            revealObserver?.unobserve(entry.target);
          }
        },
        { threshold: 0.12, rootMargin: "0px 0px -10% 0px" },
      );

      for (const node of revealNodes) {
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          node.classList.add("is-visible");
        } else {
          revealObserver.observe(node);
        }
      }
      root.classList.add("motion-enhanced");
    };

    const updatePreference = () => {
      if (reduceMotion.matches) {
        root.classList.remove("motion-enhanced");
        revealObserver?.disconnect();
        revealObserver = null;
        revealNodes.forEach((node) => node.classList.add("is-visible"));
        if (frame) window.cancelAnimationFrame(frame);
        frame = 0;
        clearHeroStyles();
      } else {
        enableReveals();
        scheduleHero();
      }
    };

    updatePreference();
    window.addEventListener("scroll", scheduleHero, { passive: true });
    window.addEventListener("resize", scheduleHero, { passive: true });
    reduceMotion.addEventListener("change", updatePreference);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      revealObserver?.disconnect();
      window.removeEventListener("scroll", scheduleHero);
      window.removeEventListener("resize", scheduleHero);
      reduceMotion.removeEventListener("change", updatePreference);
      root.classList.remove("motion-enhanced");
      clearHeroStyles();
    };
  }, []);

  return null;
}
