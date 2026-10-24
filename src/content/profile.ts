export const profile = {
  name: "Nishiki",
  kicker: "ようこそ · 欢迎来玩",
  tagline:
    "喜欢锦明日海的普通大学生。写博客、学日语、玩贝斯、折腾服务器，偶尔也做点小工具。",
  // Shown vertically beside the hero art on wide screens.
  verticalLine: "雪の街で、待ってるね。",
  bio: [
    "我是 Nishiki，心理学专业的普通学生。ID 来自《常轨脱离 Creative》（ハミダシクリエイティブ）里的锦明日海——对，就是首页那位。",
    "平时在博客写日语学习笔记、玩机折腾记录和一些生活碎碎念；和贝斯有关的视频之后也会放上来。这个站和博客都跑在我自己的小服务器上。",
    "如果你也喜欢她，或者也在学日语、玩贝斯，欢迎来博客留言打个招呼。",
  ],
  tags: ["锦明日海", "日语 N4+", "贝斯", "自建服务器"],
  blogUrl: "https://blog.nishiki.icu",
  githubUrl: "https://github.com/Maggyee",
  email: "me@nishiki.tech",
} as const;

// Lines the hero character says when clicked; the first one also plays on load.
export const greetings = [
  "欢迎来到 Nishiki 的小站～",
  "外面在下雪呢，进来暖和一下吧。",
  "今天的日语学了吗？日本語教室随时开课哦。",
  "低音不显眼，可是少了它就不行呢。",
  "肉まん……好想吃热乎乎的肉まん。",
  "博客那边有新文章的话，记得去看看。",
  "再戳也不会掉东西的啦。",
] as const;

export const credits = [
  { label: "立绘", value: "《ハミダシクリエイティブ》© まどそふと" },
  { label: "背景", value: "みんちりえ", href: "https://min-chi.material.jp/" },
] as const;

export type Profile = typeof profile;
