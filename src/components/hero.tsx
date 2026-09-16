import Image from "next/image";
import { HeroVideo } from "@/components/hero-video";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section
      id="hero"
      className="hero-section relative isolate h-[100svh] overflow-hidden bg-[color:var(--bg)]"
    >
      <span
        id="header-scroll-sentinel"
        className="pointer-events-none absolute left-0 top-3 h-px w-px"
        aria-hidden
      />

      <div className="hero-backdrop hero-scroll-bg absolute inset-[-8%] -z-20" aria-hidden>
        <HeroVideo />
      </div>

      <div
        className="hero-overlay absolute inset-0 -z-10"
        aria-hidden
      />

      <div
        className="hero-atmosphere hero-scroll-atmosphere pointer-events-none absolute inset-0 -z-[5]"
        aria-hidden
      />

      <div className="relative mx-auto grid h-full min-h-0 w-full max-w-[88rem] grid-rows-[auto_minmax(0,1fr)] gap-2 px-6 pb-8 pt-24 sm:gap-3 sm:px-9 sm:pb-10 sm:pt-28 lg:grid-cols-[minmax(0,1fr)_minmax(280px,42%)] lg:grid-rows-1 lg:items-center lg:gap-8 lg:px-14 lg:pb-14 lg:pt-24">
        <div className="hero-scroll-copy relative z-10 max-w-xl self-start lg:self-center">
          <div className="hero-enter-copy">
            <p className="section-kicker mb-3 sm:mb-4">产品 · AI · 工程</p>
            <h1 className="font-display text-[2.5rem] font-semibold leading-none tracking-tight text-[color:var(--text)] sm:text-6xl md:text-7xl">
              {profile.name}
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[color:var(--text)]/90 sm:mt-6 sm:text-xl">
              {profile.tagline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
              <a href="#works" className="primary-action">
                查看作品
              </a>
              <a
                href={profile.blogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-action"
              >
                博客<span className="external-mark" aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="hero-scroll-art pointer-events-none relative mx-auto h-full min-h-0 w-full max-w-[16rem] sm:max-w-sm lg:mx-0 lg:h-[min(72svh,700px)] lg:max-w-none">
          <div className="hero-enter-art relative h-full w-full">
            <div className="absolute inset-x-8 bottom-0 h-16 rounded-[100%] bg-[radial-gradient(circle,rgba(0,103,255,0.28),transparent_70%)] blur-2xl sm:h-24" />
            <Image
              src="/character/casual-fandisc-nishiki.png"
              alt="Nishiki 常服立绘"
              fill
              priority
              sizes="(max-width: 1024px) 60vw, 42vw"
              className="object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>

      <a
        href="#works"
        className="hero-scroll-cue absolute bottom-5 left-6 z-20 hidden items-center gap-3 text-xs tracking-[0.18em] text-[color:var(--muted)] sm:bottom-7 sm:left-9 lg:inline-flex lg:left-14"
      >
        <span>向下</span>
        <span className="scroll-cue-line" aria-hidden />
      </a>
    </section>
  );
}
