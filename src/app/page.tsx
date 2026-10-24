import { About } from "@/components/about";
import { BlogFeed } from "@/components/blog-feed";
import { Hero } from "@/components/hero";
import { Music } from "@/components/music";
import { PageBackdrop } from "@/components/page-backdrop";
import { SiteFooter } from "@/components/site-footer";
import { Snow } from "@/components/snow";
import { Works } from "@/components/works";

// Refresh the blog feed at most once an hour.
export const revalidate = 3600;

export default function Home() {
  return (
    <>
      <PageBackdrop />
      <Snow layer="page" />
      <Hero />
      <BlogFeed />
      <Music />
      <Works />
      <About />
      <SiteFooter />
    </>
  );
}
