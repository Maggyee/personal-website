import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { works } from "@/content/works";

// Stand-in cover for projects without a presentable screenshot yet.
function TraderCover() {
  const candles = [
    [40, 62, 70, 78], [64, 58, 66, 74], [88, 50, 60, 68], [112, 54, 58, 70],
    [136, 44, 52, 60], [160, 46, 50, 58], [184, 36, 46, 52], [208, 40, 44, 54],
    [232, 30, 36, 46], [256, 26, 34, 40],
  ];
  return (
    <svg className="trader-cover" viewBox="0 0 300 188" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="trader-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0d1638" />
          <stop offset="1" stopColor="#1b1f4a" />
        </linearGradient>
        <linearGradient id="trader-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc9ff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#8fc9ff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="300" height="188" fill="url(#trader-bg)" />
      {[40, 70, 100, 130].map((y) => (
        <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.06" />
      ))}
      {candles.map(([x, high, top, low], index) => {
        const up = index % 3 !== 1;
        const bottom = top + 8 + (index % 2) * 4;
        return (
          <g key={x} opacity="0.55">
            <line x1={x} x2={x} y1={high + 30} y2={low + 38} stroke={up ? "#8fc9ff" : "#c3b4ff"} strokeWidth="1" />
            <rect x={x - 4} y={top + 30} width="8" height={bottom - top} rx="1.5" fill={up ? "#8fc9ff" : "#c3b4ff"} />
          </g>
        );
      })}
      <path
        className="trader-line-fill"
        d="M0 128 C40 120 60 112 90 104 S140 96 165 84 S220 70 250 56 S285 44 300 40 V188 H0Z"
        fill="url(#trader-fill)"
      />
      <path
        className="trader-line"
        pathLength={1}
        d="M0 128 C40 120 60 112 90 104 S140 96 165 84 S220 70 250 56 S285 44 300 40"
        fill="none"
        stroke="#bfe2ff"
        strokeWidth="2"
      />
      <circle cx="300" cy="40" r="4" fill="#ffffff" className="trader-dot" />
      <text x="20" y="26" fill="#cfe4ff" fontSize="9" letterSpacing="2" opacity="0.7">
        RESEARCH ONLY · 只看不下单
      </text>
    </svg>
  );
}

export function Works() {
  return (
    <section id="works" className="page-section">
      <div className="site-container">
        <SectionHeading
          jp="つくったもの"
          title="做过的小东西"
          intro="平时顺手做的几个小东西，代码都在 GitHub 上。"
        />

        <div className="works-grid">
          {works.map((work, index) => (
            <a
              key={work.slug}
              href={work.href}
              target="_blank"
              rel="noopener noreferrer"
              className="work-card glass-card reveal-motion"
              style={{ "--stagger": index } as React.CSSProperties}
            >
              <div className="work-cover">
                {work.cover ? (
                  <Image
                    src={work.cover}
                    alt={work.coverAlt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 400px"
                    className="work-cover-img"
                  />
                ) : (
                  <TraderCover />
                )}
              </div>
              <div className="work-body">
                <p className="work-stack">{work.stack}</p>
                <h3 className="work-title">{work.title}</h3>
                <p className="work-summary">{work.summary}</p>
                <span className="work-link">
                  GitHub<span aria-hidden> ↗</span>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
