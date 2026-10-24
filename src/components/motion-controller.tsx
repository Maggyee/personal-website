"use client";

import { useEffect } from "react";
import { THEME_CHANGE_EVENT, type ThemeChangeDetail } from "@/lib/theme";

export function MotionController() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hero = document.getElementById("hero");
    const revealNodes = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal-motion"),
    );

    let revealObserver: IntersectionObserver | null = null;
    let frame = 0;
    let switchTimer = 0;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };
    let scroll = -1;

    // Hero parallax: pointer position and scroll progress are exposed as CSS
    // variables (--mx, --my, --scroll) and the stylesheet decides what moves.
    const tick = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty(
        "--page-progress",
        (scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0).toFixed(4),
      );
      if (!hero || reduceMotion.matches) return;
      const range = Math.max(hero.offsetHeight, 1);
      const nextScroll = Math.min(1, Math.max(0, window.scrollY / range));
      if (nextScroll !== scroll) {
        scroll = nextScroll;
        hero.style.setProperty("--scroll", scroll.toFixed(4));
      }
      if (nextScroll >= 1) return;

      eased.x += (pointer.x - eased.x) * 0.08;
      eased.y += (pointer.y - eased.y) * 0.08;
      hero.style.setProperty("--mx", eased.x.toFixed(4));
      hero.style.setProperty("--my", eased.y.toFixed(4));
      if (Math.abs(pointer.x - eased.x) > 0.001 || Math.abs(pointer.y - eased.y) > 0.001) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") return;
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
      schedule();
    };

    const onThemeChange = (event: Event) => {
      if (!(event as CustomEvent<ThemeChangeDetail>).detail?.sceneChanged) return;
      if (!hero || reduceMotion.matches) return;
      hero.classList.remove("is-switching");
      // Restart the scene transition even on rapid toggles.
      void hero.offsetWidth;
      hero.classList.add("is-switching");
      window.clearTimeout(switchTimer);
      switchTimer = window.setTimeout(() => hero.classList.remove("is-switching"), 1100);
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
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
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
        hero?.style.removeProperty("--mx");
        hero?.style.removeProperty("--my");
        hero?.style.removeProperty("--scroll");
        schedule();
      } else {
        enableReveals();
        schedule();
      }
    };

    updatePreference();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener(THEME_CHANGE_EVENT, onThemeChange);
    reduceMotion.addEventListener("change", updatePreference);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.clearTimeout(switchTimer);
      revealObserver?.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener(THEME_CHANGE_EVENT, onThemeChange);
      reduceMotion.removeEventListener("change", updatePreference);
      root.classList.remove("motion-enhanced");
    };
  }, []);

  return null;
}
