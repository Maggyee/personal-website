import { PointerGlow } from "@/components/pointer-glow";
import { profile } from "@/content/profile";

export function About() {
  return (
    <section
      id="about"
      className="section-screen border-t border-[color:var(--border)]"
    >
      <div className="section-screen-inner site-container">
        <div className="reveal-motion mb-8 max-w-3xl">
          <h2 className="section-title">关于</h2>
        </div>

        <div className="reveal-motion reveal-motion-late max-w-3xl">
          <PointerGlow className="about-stage relative overflow-hidden rounded-[1.5rem] border border-[color:var(--border)] bg-[color:var(--surface)]">
            <div className="relative z-10 flex flex-col gap-8 p-7 sm:p-10">
              <p className="text-lg leading-9 text-[color:var(--text)]/92 sm:text-xl sm:leading-10">
                {profile.bio}
              </p>
              <div className="flex flex-wrap gap-5 text-sm">
                <a
                  href={profile.blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--brand)] transition-opacity duration-200 hover:opacity-80"
                >
                  博客<span className="external-mark" aria-hidden>↗</span>
                </a>
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[color:var(--muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
                >
                  GitHub<span className="external-mark" aria-hidden>↗</span>
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-[color:var(--muted)] transition-colors duration-200 hover:text-[color:var(--text)]"
                >
                  {profile.email}
                </a>
              </div>
            </div>
          </PointerGlow>
        </div>
      </div>
    </section>
  );
}
