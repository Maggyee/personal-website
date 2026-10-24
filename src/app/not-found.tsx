import Image from "next/image";
import Link from "next/link";
import { PageBackdrop } from "@/components/page-backdrop";
import { Snow } from "@/components/snow";
import { profile } from "@/content/profile";

export default function NotFound() {
  return (
    <>
      <PageBackdrop />
      <Snow layer="page" />
      <section className="lost site-container">
        <div className="lost-art">
          <p className="lost-bubble">诶？这里什么都没有哦……</p>
          <div className="lost-figure">
            <Image
              src="/character/school-uniform-nishiki.png"
              alt="歪着头的锦明日海"
              fill
              priority
              sizes="(max-width: 767px) 60vw, 20rem"
              className="lost-img"
            />
          </div>
        </div>

        <div className="lost-copy">
          <p className="section-jp">
            <span className="section-flake" aria-hidden>
              ❄
            </span>
            404 · まいご
          </p>
          <h1 className="lost-title">迷路了吗？</h1>
          <p className="lost-text">
            这个页面不存在，可能是链接写错了，也可能被雪埋起来了。
          </p>
          <div className="hero-actions">
            <Link href="/" className="primary-action">
              回首页
            </Link>
            <a
              href={profile.blogUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="secondary-action"
            >
              去博客看看<span className="external-mark" aria-hidden>↗</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
