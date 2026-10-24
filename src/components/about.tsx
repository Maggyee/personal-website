import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/content/profile";

// Names that should never be split across lines.
const unbreakable = /(锦明日海|《[^》]+》|（[^）]+）)/;

function KeepNames({ text }: { text: string }) {
  return text.split(unbreakable).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function About() {
  return (
    <section id="about" className="page-section">
      <div className="site-container">
        <SectionHeading jp="わたし" title="关于" mark="Hello" />

        <div className="about-layout">
          <figure className="about-portrait reveal-motion" aria-hidden>
            <Image
              src="/character/school-uniform-nishiki.png"
              alt=""
              fill
              sizes="(max-width: 767px) 60vw, 18rem"
              className="about-portrait-img"
            />
          </figure>

          <div className="about-card glass-card reveal-motion">
            {profile.bio.map((paragraph) => (
              <p key={paragraph} className="about-text">
                <KeepNames text={paragraph} />
              </p>
            ))}

            <ul className="about-tags" aria-label="标签">
              {profile.tags.map((tag) => (
                <li key={tag}>#{tag}</li>
              ))}
            </ul>

            <div className="about-links">
              <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer" className="pill-link">
                博客<span className="external-mark" aria-hidden>↗</span>
              </a>
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="pill-link">
                GitHub<span className="external-mark" aria-hidden>↗</span>
              </a>
              <a href={`mailto:${profile.email}`} className="pill-link">
                {profile.email}
              </a>
            </div>

            <p className="about-friends">
              想交换友链？去
              <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer">
                博客
              </a>
              留言就好。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
