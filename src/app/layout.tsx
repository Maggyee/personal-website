import type { Metadata } from "next";
import { Fraunces, Geist, Noto_Serif_SC } from "next/font/google";
import { MotionController } from "@/components/motion-controller";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import {
  DAY_START_HOUR,
  DUSK_START_HOUR,
  NIGHT_START_HOUR,
  THEME_STORAGE_KEY,
} from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
});

// Body text uses the system's Chinese font (see globals.css); only headings
// load a CJK web font, and only the glyphs they actually use get downloaded.
const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["Songti SC", "SimSun", "serif"],
});

export const metadata: Metadata = {
  title: "Nishiki",
  description: "Nishiki 的个人主页：博客、日语、贝斯，和一些自己做的小东西。",
  metadataBase: new URL("https://nishikicn.com"),
  openGraph: {
    title: "Nishiki",
    description: "喜欢锦明日海的普通大学生。写博客、学日语、玩贝斯、折腾服务器。",
    locale: "zh_CN",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Mirrors themeForHour() in lib/theme.ts; runs before paint so the right
// scene shows immediately.
const themeBootScript = `
  (function () {
    var preference = "auto";
    try {
      var stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
      if (["auto", "ice", "dusk", "night"].indexOf(stored) >= 0) preference = stored;
    } catch (_) {}
    var theme = preference;
    if (preference === "auto") {
      var hour = new Date().getHours();
      theme = hour >= ${DAY_START_HOUR} && hour < ${DUSK_START_HOUR} ? "ice"
        : hour >= ${DUSK_START_HOUR} && hour < ${NIGHT_START_HOUR} ? "dusk" : "night";
    }
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "ice" ? "light" : "dark";
  })();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hans"
      data-theme="night"
      className={`${geistSans.variable} ${display.variable} ${notoSerifSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full bg-[color:var(--bg)] text-[color:var(--text)]">
        <ThemeProvider>
          <a href="#main" className="skip-link">
            跳到正文
          </a>
          <MotionController />
          <SiteHeader />
          <main id="main">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
