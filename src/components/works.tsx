import Image from "next/image";
import { works, type Work } from "@/content/works";

function WorkMeta({ work }: { work: Work }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
      <span className="text-[color:var(--brand)]">{work.category}</span>
      <span className="text-[color:var(--muted)]" aria-hidden>
        ·
      </span>
      <span className="text-[color:var(--brand)]">{work.year}</span>
      <span className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-[color:var(--muted)]">
        {work.language}
      </span>
      <span className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-[color:var(--muted)]">
        {work.visibility}
      </span>
    </div>
  );
}

export function Works() {
  const featured = works.find((work) => work.featured);
  const secondary = works.filter((work) => !work.featured);

  return (
    <section
      id="works"
      className="section-screen border-t border-[color:var(--border)]"
    >
      <div className="section-screen-inner site-container">
        <div className="reveal-motion mb-8 max-w-2xl shrink-0">
          <h2 className="section-title">作品</h2>
          <p className="mt-3 text-[color:var(--muted)]">
            三个正在持续演进的作品，关于研究、产品工作流与阅读体验。
          </p>
        </div>

        <div className="reveal-motion reveal-motion-late grid gap-5">
          {featured ? (
            <a
              href={featured.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-[1.5rem] surface-card transition-[transform,border-color,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:border-[color:var(--brand)]/35"
            >
              <div className="relative aspect-[4/3] overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--surface-2)] sm:aspect-[16/7]">
                <Image
                  src={featured.cover}
                  alt={featured.coverAlt}
                  fill
                  priority
                  sizes="(max-width: 1536px) 100vw, 1408px"
                  className="object-cover object-top motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.015]"
                />
                <div
                  className="work-cover-fade pointer-events-none absolute inset-0"
                  aria-hidden
                />
                <span className="work-cover-badge absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs font-medium sm:left-6 sm:top-6">
                  精选
                </span>
              </div>
              <div className="grid gap-5 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                <div>
                  <div className="mb-3">
                    <WorkMeta work={featured} />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[color:var(--text)] sm:text-3xl">
                    {featured.title}
                  </h3>
                  <p className="mt-3 max-w-3xl leading-relaxed text-[color:var(--muted)]">
                    {featured.summary}
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--text)]">
                  查看项目 <span aria-hidden>↗</span>
                </span>
              </div>
            </a>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {secondary.map((work) => (
              <a
                key={work.slug}
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group overflow-hidden rounded-[1.5rem] surface-card transition-[transform,border-color,box-shadow] duration-300 motion-safe:hover:-translate-y-1 hover:border-[color:var(--brand)]/35"
              >
                <div className="relative aspect-video overflow-hidden border-b border-[color:var(--border)] bg-[color:var(--surface-2)]">
                  <Image
                    src={work.cover}
                    alt={work.coverAlt}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-[1.02]"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <WorkMeta work={work} />
                  <h3 className="mt-3 font-display text-xl font-semibold text-[color:var(--text)] sm:text-2xl">
                    {work.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)] sm:text-base">
                    {work.summary}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--text)]">
                    查看项目 <span aria-hidden>↗</span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
