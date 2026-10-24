import Image from "next/image";
import { BassStrings } from "@/components/bass-strings";
import { SectionHeading } from "@/components/section-heading";
import { videos, type Video } from "@/content/music";

function VideoCard({ video }: { video: Video }) {
  return (
    <figure className="video-card glass-card">
      <div className="video-frame">
        {"bvid" in video ? (
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${video.bvid}&autoplay=0`}
            title={video.title}
            loading="lazy"
            allowFullScreen
          />
        ) : (
          <video src={video.src} poster={video.poster} controls preload="metadata" />
        )}
      </div>
      <figcaption>
        <span>{video.title}</span>
        <time dateTime={video.date}>{video.date.replaceAll("-", ".")}</time>
      </figcaption>
    </figure>
  );
}

export function Music() {
  return (
    <section id="music" className="page-section">
      <div className="site-container">
        <SectionHeading
          jp="ベース"
          title="低音区"
          mark="Bass"
          intro="和贝斯有关的视频之后会放在这里。在那之前，先拨两下弦吧。"
        />

        <div className="music-layout">
          <div className="music-main">
            <div className="glass-card bass-card reveal-motion">
              <BassStrings />
            </div>

            {videos.length > 0 ? (
              <div className="video-grid">
                {videos.map((video) => (
                  <VideoCard key={video.title} video={video} />
                ))}
              </div>
            ) : (
              <div className="video-placeholder glass-card reveal-motion">
                <span className="eq" aria-hidden>
                  <i />
                  <i />
                  <i />
                  <i />
                </span>
                <div>
                  <p className="video-placeholder-title">第一支视频还在路上</p>
                  <p className="video-placeholder-text">录好了就放上来，先在这里占个位置。</p>
                </div>
              </div>
            )}
          </div>

          <figure className="music-art reveal-motion" aria-hidden>
            <Image
              src="/character/yukige-shiki.png"
              alt=""
              fill
              sizes="(max-width: 1024px) 60vw, 22rem"
              className="music-art-img"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
