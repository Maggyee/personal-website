import type { Metadata } from "next";
import {
  Fraunces,
  Geist,
  Noto_Sans_SC,
  Noto_Serif_SC,
} from "next/font/google";
import { MotionController } from "@/components/motion-controller";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { THEME_STORAGE_KEY } from "@/lib/theme";
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

const notoSansSC = Noto_Sans_SC({
  variable: "--font-cjk",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["PingFang SC", "Microsoft YaHei", "sans-serif"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-serif",
  weight: ["500", "600", "700"],
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
  },
};

const themeBootScript = `
  try {
    var theme = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    if (theme !== "ice" && theme !== "night") theme = "night";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "night" ? "dark" : "light";
    document.documentElement.classList.toggle("theme-night", theme === "night");
    document.documentElement.classList.toggle("theme-ice", theme === "ice");
  } catch (_) {}
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
      className={`${geistSans.variable} ${display.variable} ${notoSansSC.variable} ${notoSerifSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full bg-[color:var(--bg)] text-[color:var(--text)]">
        <ThemeProvider>
          <a href="#blog" className="skip-link">
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
