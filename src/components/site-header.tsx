"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { profile } from "@/content/profile";
import { themes } from "@/lib/theme";

const nav = [
  { href: "#blog", id: "blog", label: "文章" },
  { href: "#music", id: "music", label: "低音区" },
  { href: "#works", id: "works", label: "小东西" },
  { href: "#about", id: "about", label: "关于" },
  { href: profile.blogUrl, label: "博客", external: true },
] as const;

const sectionIds = ["hero", ...nav.flatMap((item) => ("id" in item ? [item.id] : []))];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const sentinel = document.getElementById("header-scroll-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      setScrolled(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (sections.length === 0) return;

    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.intersectionRatio);
        }
        let next = "hero";
        let best = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > best) {
            best = ratio;
            next = id;
          }
        }
        if (best > 0) setActiveId(next);
      },
      {
        threshold: [0.15, 0.3, 0.5, 0.7],
        rootMargin: "-18% 0px -42% 0px",
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={[
          "header-shell pointer-events-auto glass-panel mx-auto flex w-full max-w-7xl items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-4",
          scrolled ? "header-glass-dense" : "header-glass-soft",
        ].join(" ")}
      >
        <a
          href="#hero"
          className="brand-lockup flex min-w-0 shrink-0 items-center gap-3 pl-1"
          aria-current={activeId === "hero" ? "true" : undefined}
        >
          <span className="brand-avatar-shell">
            <Image
              src="/brand/logo-avatar.png"
              alt="Nishiki 站标头像"
              width={40}
              height={40}
              priority
              className="brand-avatar-img"
            />
          </span>
          <span className="brand-wordmark">{profile.name}</span>
        </a>

        <nav className="hidden items-center gap-1 text-sm md:flex" aria-label="页面区块">
          {nav.map((item) =>
            "external" in item && item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link rounded-full px-3 py-2 transition-colors"
              >
                {item.label}
                <span className="external-mark" aria-hidden>
                  ↗
                </span>
              </a>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="nav-link rounded-full px-3 py-2 transition-colors"
                aria-current={"id" in item && item.id === activeId ? "true" : undefined}
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            data-theme={theme}
            aria-label={`切换主题，当前：${themes[theme].label}`}
            title={`切换到${themes[theme === "night" ? "ice" : "night"].label}`}
          >
            <span className="theme-toggle-thumb" aria-hidden />
            <svg
              className="theme-toggle-icon theme-toggle-sun"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden
            >
              <circle cx="12" cy="12" r="3.25" />
              <path d="M12 2.75v2M12 19.25v2M4.25 12h-2M21.75 12h-2M5.17 5.17l1.42 1.42M17.41 17.41l1.42 1.42M18.83 5.17l-1.42 1.42M6.59 17.41l-1.42 1.42" />
            </svg>
            <svg
              className="theme-toggle-icon theme-toggle-moon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M18.2 16.2A7.2 7.2 0 0 1 9 6.7a7.4 7.4 0 1 0 9.2 9.5Z" />
            </svg>
          </button>

          <button
            type="button"
            className="menu-button inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--text)] transition-colors duration-200 md:hidden"
            data-open={open}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "关闭导航" : "打开导航"}
            onClick={() => setOpen((v) => !v)}
          >
            <div className="menu-icon flex w-4 flex-col gap-1.5" aria-hidden>
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </div>
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className="mobile-menu-shell pointer-events-auto mx-auto mt-2 w-full max-w-7xl md:hidden"
        data-open={open}
        aria-hidden={!open}
        inert={open ? undefined : true}
      >
        <div className="mobile-menu-clip">
          <div className="glass-panel rounded-[1.5rem] px-4 py-4">
            <div className="flex flex-col gap-1 text-sm text-[color:var(--muted)]">
            {nav.map((item) =>
              "external" in item && item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl px-3 py-3 text-[color:var(--text)] transition-colors duration-200 hover:bg-[color:var(--text)]/5"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  <span className="external-mark" aria-hidden>
                    ↗
                  </span>
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-[color:var(--text)] transition-colors duration-200 hover:bg-[color:var(--text)]/5"
                  aria-current={"id" in item && item.id === activeId ? "true" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              ),
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
