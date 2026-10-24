export type Work = {
  slug: string;
  title: string;
  summary: string;
  stack: string;
  href: string;
  // Omit to render the illustrated cover instead of a screenshot.
  cover?: string;
  coverAlt: string;
};

export const works: Work[] = [
  {
    slug: "nishiki-flutter",
    title: "Nishiki Blog Reader",
    summary:
      "想在手机上舒服地读自己的博客，就用 Flutter 写了个阅读器：订阅 RSS、收藏文章、调字体，深色模式也安排上了。",
    stack: "Flutter · 阅读器",
    href: "https://github.com/Maggyee/nishiki-flutter",
    cover: "/works/nishiki-flutter/cover.png",
    coverAlt: "Nishiki Blog Reader 的手机界面",
  },
  {
    slug: "pmstudio",
    title: "PM Studio",
    summary:
      "丢一句产品点子进去，它帮你整理出需求、竞品和路线图，最后打包成一份能拿去讨论的方案。",
    stack: "AI · 产品工具",
    href: "https://github.com/Maggyee/pmstudio",
    cover: "/works/pmstudio/cover.png",
    coverAlt: "PM Studio 首页",
  },
  {
    slug: "nishiki-trader",
    title: "Nishiki Trader",
    summary:
      "对金融一直有兴趣，就试着搭了个量化研究系统：几个 AI Agent 负责研究，机器学习给信号，目前只看不下单。",
    stack: "Python · 量化",
    href: "https://github.com/Maggyee/Nishiki-Trader",
    coverAlt: "Nishiki Trader 的示意封面：一条价格走势线",
  },
];
