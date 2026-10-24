import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/content/profile";
import { getJapaneseColumn, getRecentPosts } from "@/lib/blog";

const formatDate = (date: string) => date.slice(0, 10).replaceAll("-", ".");

export async function BlogFeed() {
  const [posts, column] = await Promise.all([getRecentPosts(), getJapaneseColumn()]);

  return (
    <section id="blog" className="page-section">
      <div className="site-container">
        <SectionHeading
          jp="ブログ"
          title="最近在写"
          intro="日语笔记、玩机折腾和生活碎碎念，都在博客里。"
          action={
            <a
              href={profile.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              全部文章<span className="external-mark" aria-hidden>↗</span>
            </a>
          }
        />

        <div className="blog-grid">
          <a
            href={column?.link ?? profile.blogUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="column-card glass-card reveal-motion"
          >
            <span className="column-kana" aria-hidden>
              あ
            </span>
            <span className="column-label">专栏</span>
            <h3 className="column-title">明日海の日本語教室</h3>
            <p className="column-text">
              跟着明日海一起学日语的每日笔记
              {column?.lessons ? `，已经写到 Day ${column.lessons}` : ""}。
            </p>
            {column?.recent.length ? (
              <ol className="column-lessons" aria-label="最近几课">
                {column.recent.map((lesson) => (
                  <li key={lesson.id}>
                    <time dateTime={lesson.date}>{formatDate(lesson.date).slice(5)}</time>
                    <span>{lesson.title.replace("明日海の日本語教室", "").trim()}</span>
                  </li>
                ))}
              </ol>
            ) : null}
            <span className="column-cta">
              进入专栏<span aria-hidden> ↗</span>
            </span>
          </a>

          {posts && posts.length > 0 ? (
            <ol className="post-list">
              {posts.map((post, index) => (
                <li
                  key={post.id}
                  className="reveal-motion"
                  style={{ "--stagger": index } as React.CSSProperties}
                >
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="post-row glass-card"
                  >
                    <span className="post-meta">
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                      <span className="post-category">{post.category}</span>
                    </span>
                    <span className="post-title">{post.title}</span>
                    {post.excerpt ? <span className="post-excerpt">{post.excerpt}</span> : null}
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <a
              href={profile.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="post-fallback glass-card reveal-motion"
            >
              博客暂时没连上，直接过去看看吧<span aria-hidden> ↗</span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
