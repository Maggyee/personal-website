export const profile = {
  name: "Nishiki",
  tagline: "把想法做成能运行、能验证的产品，也留一点二次元和音乐。",
  bio: "我是 Nishiki，关注产品、AI 与工程实践，也长期泡在二次元和音乐里。我喜欢把模糊的想法整理成能运行、能验证的产品：从 AI 产品规划工具、跨端博客阅读器，到仍在持续演进的量化研究系统。这里记录其中最值得公开的作品与项目。",
  blogUrl: "https://blog.nishiki.icu",
  githubUrl: "https://github.com/Maggyee",
  email: "me@nishiki.tech",
} as const;

export type Profile = typeof profile;
