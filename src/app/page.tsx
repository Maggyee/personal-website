import { About } from "@/components/about";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { Works } from "@/components/works";

export default function Home() {
  return (
    <>
      <Hero />
      <Works />
      <About />
      <SiteFooter />
    </>
  );
}
