"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { greetings } from "@/content/profile";

const INTRO_DELAY = 1900;
const LINE_DURATION = 4200;

export function HeroCharacter() {
  const [line, setLine] = useState<string>(greetings[0]);
  const [visible, setVisible] = useState(false);
  const lineIndex = useRef(0);
  const hideTimer = useRef(0);

  const say = (index: number) => {
    lineIndex.current = index;
    setLine(greetings[index]);
    setVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setVisible(false), LINE_DURATION);
  };

  useEffect(() => {
    const timers = hideTimer;
    const intro = window.setTimeout(() => {
      setVisible(true);
      timers.current = window.setTimeout(() => setVisible(false), LINE_DURATION);
    }, INTRO_DELAY);
    return () => {
      window.clearTimeout(intro);
      window.clearTimeout(timers.current);
    };
  }, []);

  const onClick = () => {
    // Pick any line except the one currently showing.
    const next = 1 + Math.floor(Math.random() * (greetings.length - 1));
    say(next === lineIndex.current ? (next % (greetings.length - 1)) + 1 : next);
  };

  return (
    <div className="hero-art">
      <div className="char-parallax">
        <div className="char-enter">
          <div className="char-float">
            <span className="char-glow" aria-hidden />
            <button
              type="button"
              className="char-button"
              aria-label="和锦明日海打个招呼"
              onClick={onClick}
            >
              <Image
                src="/character/casual-fandisc-nishiki.png"
                alt="锦明日海的常服立绘"
                fill
                priority
                sizes="(max-width: 1024px) 70vw, 34vw"
                className="char-img"
              />
            </button>
          </div>
        </div>
      </div>
      <p className="char-bubble" data-visible={visible} aria-live="polite">
        {line}
      </p>
    </div>
  );
}
