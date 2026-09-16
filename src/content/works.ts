export type Work = {
  slug: string;
  title: string;
  summary: string;
  year: string;
  category: string;
  href: string;
  cover: string;
  coverAlt: string;
  language: string;
  visibility: "公开" | "私有";
  featured?: boolean;
};

export const works: Work[] = [
  {
    slug: "nishiki-trader",
    title: "Nishiki Trader",
    summary:
      "连接多 Agent 研究、机器学习信号与 NautilusTrader 执行层的个人量化交易系统；当前以只读监控、证据链和风险边界为核心。",
    year: "2026",
    category: "量化研究系统",
    href: "https://github.com/Maggyee/Nishiki-Trader",
    cover: "/works/nishiki-trader/cover.png",
    coverAlt: "Nishiki Trader 只读运维控制台界面",
    language: "Python",
    visibility: "私有",
    featured: true,
  },
  {
    slug: "pmstudio",
    title: "PM Studio",
    summary:
      "把一句产品想法或一份 PRD 整理成可评审的产品包，覆盖需求、原型结构、竞品、市场、路线图与执行摘要。",
    year: "2026",
    category: "AI 产品工具",
    href: "https://github.com/Maggyee/pmstudio",
    cover: "/works/pmstudio/cover.png",
    coverAlt: "PM Studio 产品规划工作台首页",
    language: "TypeScript",
    visibility: "公开",
  },
  {
    slug: "nishiki-flutter",
    title: "Nishiki Blog Reader",
    summary:
      "面向 WordPress 与 RSS 的 Flutter 博客阅读器，串联搜索、分类、收藏、字体调整与阅读进度等跨端体验。",
    year: "2026",
    category: "跨端阅读器",
    href: "https://github.com/Maggyee/nishiki-flutter",
    cover: "/works/nishiki-flutter/cover.png",
    coverAlt: "Nishiki Blog Reader 跨端阅读器界面展示",
    language: "Dart",
    visibility: "公开",
  },
];
