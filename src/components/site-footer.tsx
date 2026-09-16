import { profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="section-footer border-t border-[color:var(--border)]">
      <div className="site-container flex flex-col justify-center gap-6 py-12 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex flex-wrap gap-5">
          <a
            href={profile.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-[color:var(--text)]"
          >
            博客<span className="external-mark" aria-hidden>↗</span>
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:text-[color:var(--text)]"
          >
            GitHub<span className="external-mark" aria-hidden>↗</span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="transition-colors duration-200 hover:text-[color:var(--text)]"
          >
            邮箱
          </a>
          <a href="#hero" className="transition-colors duration-200 hover:text-[color:var(--text)]">
            回到顶部
          </a>
        </div>
      </div>
    </footer>
  );
}
