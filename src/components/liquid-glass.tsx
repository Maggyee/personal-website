"use client";

import { useEffect, useRef } from "react";

const FILTER_ID = "liquid-lens";

type NavigatorWithBrands = Navigator & {
  userAgentData?: { brands: { brand: string }[] };
};

// Displacement map for a pill-shaped lens. Pixels near the rim sample from
// further inside, so whatever sits behind the edge bends like thick glass.
function buildLensMap(width: number, height: number, band: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const image = ctx.createImageData(width, height);
  const radius = height / 2;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      // Nearest point on the pill's centre line, then the outward normal.
      const cx = Math.min(Math.max(x + 0.5, radius), width - radius);
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - radius;
      const distance = Math.hypot(dx, dy) || 1;
      const inset = radius - distance;
      const strength = inset > 0 && inset < band ? (1 - inset / band) ** 2 : 0;
      const index = (y * width + x) * 4;
      image.data[index] = 128 - (dx / distance) * strength * 127;
      image.data[index + 1] = 128 - (dy / distance) * strength * 127;
      image.data[index + 2] = 128;
      image.data[index + 3] = 255;
    }
  }

  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

/**
 * Liquid-glass treatment for a pill-shaped container: pointer-driven specular
 * highlights everywhere, plus real edge refraction where the browser supports
 * SVG filters in backdrop-filter (Chromium).
 */
export function LiquidGlass({ targetRef }: { targetRef: React.RefObject<HTMLElement | null> }) {
  const mapRef = useRef<SVGFEImageElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    const map = mapRef.current;
    if (!target || !map) return;

    const brands = (navigator as NavigatorWithBrands).userAgentData?.brands ?? [];
    const lensSupported = brands.some(({ brand }) => brand === "Chromium");
    let rebuildTimer = 0;
    let resizeObserver: ResizeObserver | null = null;

    const rebuild = () => {
      const width = Math.round(target.offsetWidth);
      const height = Math.round(target.offsetHeight);
      if (!width || !height) return;
      map.setAttribute("href", buildLensMap(width, height, Math.min(18, height * 0.34)));
      map.setAttribute("width", String(width));
      map.setAttribute("height", String(height));
      target.classList.add("has-lens");
    };

    if (lensSupported) {
      rebuild();
      // The header changes width while it morphs; rebuild once it settles.
      resizeObserver = new ResizeObserver(() => {
        window.clearTimeout(rebuildTimer);
        rebuildTimer = window.setTimeout(rebuild, 140);
      });
      resizeObserver.observe(target);
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      target.style.setProperty("--gx", `${x}px`);
      target.style.setProperty("--gy", `${y}px`);
      target.style.setProperty("--rim-angle", `${90 + (x / rect.width - 0.5) * 150}deg`);
    };
    const onPointerLeave = () => target.style.removeProperty("--rim-angle");

    target.addEventListener("pointermove", onPointerMove);
    target.addEventListener("pointerleave", onPointerLeave);

    return () => {
      window.clearTimeout(rebuildTimer);
      resizeObserver?.disconnect();
      target.removeEventListener("pointermove", onPointerMove);
      target.removeEventListener("pointerleave", onPointerLeave);
      target.classList.remove("has-lens");
    };
  }, [targetRef]);

  return (
    <>
      <svg className="liquid-defs" aria-hidden width="0" height="0">
        <filter id={FILTER_ID} colorInterpolationFilters="sRGB">
          <feImage ref={mapRef} x="0" y="0" preserveAspectRatio="none" result="lens" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lens"
            scale="34"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
      <span className="liquid-sheen" aria-hidden />
      <span className="liquid-glare" aria-hidden />
      <span className="liquid-rim" aria-hidden />
    </>
  );
}
