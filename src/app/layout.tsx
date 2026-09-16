import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_SC,
  Plus_Jakarta_Sans,
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

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const display = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-cjk",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  fallback: ["PingFang SC", "Microsoft YaHei", "sans-serif"],
});

export const metadata: Metadata = {
  title: "Nishiki",
  description: "Nishiki 的个人主页：产品、AI、工程实践与持续演进的作品。",
  metadataBase: new URL("https://nishiki.icu"),
  openGraph: {
    title: "Nishiki",
    description: "把想法做成能运行、能验证的产品。",
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
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} ${notoSansSC.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full bg-[color:var(--bg)] text-[color:var(--text)]">
        <ThemeProvider>
          <a href="#works" className="skip-link">
            跳到作品
          </a>
          <MotionController />
          <SiteHeader />
          <main id="main">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
