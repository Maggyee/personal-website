import Image from "next/image";
import { HeroCharacter } from "@/components/hero-character";
import { Snow } from "@/components/snow";
import { profile } from "@/content/profile";

export function Hero() {
  return (
    <section id="hero" className="hero">
      <span
        id="header-scroll-sentinel"
        className="pointer-events-none absolute left-0 top-3 h-px w-px"
        aria-hidden
      />

      <div className="scene" aria-hidden>
        <div className="scene-frame">
          {/* The same street at three times of day; the theme decides which shows. */}
          <Image
            src="/scene/street-day.jpg"
            alt=""
            fill
            loading="eager"
            sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
            className="scene-img scene-day"
          />
          <Image
            src="/scene/street-dusk.jpg"
            alt=""
            fill
            loading="eager"
            sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
            className="scene-img scene-dusk"
          />
          <Image
            src="/scene/street-night.jpg"
            alt=""
            fill
            priority
            sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
            className="scene-img scene-night"
          />
          <span className="scene-lamp" />
          <span className="scene-lamp-pool" />
          <span className="scene-lamp-far" />
        </div>
        <div className="scene-shade">
          <span className="shade-ice" />
          <span className="shade-dusk" />
          <span className="shade-night" />
        </div>
      </div>

      <Snow layer="back" />

      <div className="hero-inner site-container">
        <div className="hero-copy">
          <p className="hero-kicker hero-rise" style={{ "--d": "0.15s" } as React.CSSProperties}>
            {profile.kicker}
          </p>
          <h1 className="hero-title" aria-label={profile.name}>
            {[...profile.name].map((letter, index) => (
              <span
                key={index}
                aria-hidden
                style={{ "--i": index } as React.CSSProperties}
              >
                {letter}
              </span>
            ))}
          </h1>
          <p className="hero-tagline hero-rise" style={{ "--d": "0.75s" } as React.CSSProperties}>
            {profile.tagline}
          </p>
          <div className="hero-actions hero-rise" style={{ "--d": "0.95s" } as React.CSSProperties}>
            <a
              href={profile.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-action"
            >
              去博客看看<span className="external-mark" aria-hidden>↗</span>
            </a>
            <a href="#blog" className="secondary-action">
              先在这逛逛
            </a>
          </div>
        </div>

        <HeroCharacter />
      </div>

      <Snow layer="front" />

      <p className="hero-vertical" aria-hidden>
        {profile.verticalLine}
      </p>

      <a href="#blog" className="hero-scroll-cue">
        <span>往下走走</span>
        <span className="scroll-cue-track" aria-hidden />
      </a>
    </section>
  );
}
