"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { LiquidGlass } from "@/components/liquid-glass";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile } from "@/content/profile";

const nav = [
  { href: "/#blog", id: "blog", label: "文章" },
  { href: "/#music", id: "music", label: "低音区" },
  { href: "/#works", id: "works", label: "小东西" },
  { href: "/#about", id: "about", label: "关于" },
  { href: profile.blogUrl, label: "博客", external: true },
] as const;

const sectionIds = ["hero", ...nav.flatMap((item) => ("id" in item ? [item.id] : []))];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("hero");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const pillLeft = useRef<number | null>(null);

  const activeIndex = nav.findIndex((item) => "id" in item && item.id === activeId);
  const pillIndex = hoverIndex ?? activeIndex;

  // The nav pill slides like a droplet: the leading edge moves first and the
  // trailing edge catches up, so it stretches on the way and settles.
  useLayoutEffect(() => {
    const navEl = navRef.current;
    const pill = pillRef.current;
    if (!navEl || !pill) return;

    const place = (animate: boolean) => {
      const link = navEl.querySelectorAll<HTMLElement>(".nav-link")[pillIndex];
      if (!link) {
        pill.dataset.visible = "false";
        pillLeft.current = null;
        return;
      }
      const left = link.offsetLeft;
      const right = navEl.clientWidth - left - link.offsetWidth;
      const previous = pillLeft.current;
      const movingRight = previous === null || left > previous;
      const lead = animate && previous !== null ? "0.28s" : "0s";
      const trail = animate && previous !== null ? "0.5s" : "0s";
      pill.style.setProperty("--pill-dl", movingRight ? trail : lead);
      pill.style.setProperty("--pill-dr", movingRight ? lead : trail);
      pill.style.setProperty("--pill-l", `${left}px`);
      pill.style.setProperty("--pill-r", `${right}px`);
      pill.dataset.visible = "true";
      pillLeft.current = left;
    };

    place(true);
    const observer = new ResizeObserver(() => place(false));
    observer.observe(navEl);
    return () => observer.disconnect();
  }, [pillIndex]);

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
        ref={shellRef}
        className={[
          "header-shell pointer-events-auto mx-auto flex w-full items-center justify-between gap-3 rounded-full px-3 py-2 sm:px-4",
          scrolled ? "is-compact" : "",
        ].join(" ")}
      >
        <LiquidGlass targetRef={shellRef} />
        <span className="header-progress" aria-hidden />
        <Link
          href="/#hero"
          className="brand-lockup relative flex min-w-0 shrink-0 items-center gap-3 pl-1"
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
        </Link>

        <nav
          ref={navRef}
          className="header-nav hidden items-center gap-1 text-sm md:flex"
          aria-label="页面区块"
          onPointerLeave={() => setHoverIndex(null)}
        >
          <span ref={pillRef} className="nav-pill" data-visible="false" aria-hidden />
          {nav.map((item, index) =>
            "external" in item && item.external ? (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link rounded-full px-3 py-2 transition-colors"
                onPointerEnter={() => setHoverIndex(index)}
                onFocus={() => setHoverIndex(index)}
                onBlur={() => setHoverIndex(null)}
              >
                {item.label}
                <span className="external-mark" aria-hidden>
                  ↗
                </span>
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link rounded-full px-3 py-2 transition-colors"
                aria-current={"id" in item && item.id === activeId ? "true" : undefined}
                onPointerEnter={() => setHoverIndex(index)}
                onFocus={() => setHoverIndex(index)}
                onBlur={() => setHoverIndex(null)}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="relative flex items-center gap-2">
          <ThemeToggle />

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
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-xl px-3 py-3 text-[color:var(--text)] transition-colors duration-200 hover:bg-[color:var(--text)]/5"
                  aria-current={"id" in item && item.id === activeId ? "true" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
