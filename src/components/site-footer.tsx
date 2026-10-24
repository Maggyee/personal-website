import { credits, profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-inner">
        <div className="footer-meta">
          <p>
            © {new Date().getFullYear()} {profile.name} · 在雪街里慢慢更新
          </p>
          <p className="footer-credits">
            {credits.map((credit) => (
              <span key={credit.label}>
                {credit.label}：
                {"href" in credit ? (
                  <a href={credit.href} target="_blank" rel="noopener noreferrer">
                    {credit.value}
                  </a>
                ) : (
                  credit.value
                )}
              </span>
            ))}
          </p>
        </div>
        <div className="footer-links">
          <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer">
            博客<span className="external-mark" aria-hidden>↗</span>
          </a>
          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub<span className="external-mark" aria-hidden>↗</span>
          </a>
          <a href={`mailto:${profile.email}`}>邮箱</a>
          <a href="#hero">回到顶部</a>
        </div>
      </div>
    </footer>
  );
}
