import { profile } from "@/content/profile";

const API = `${profile.blogUrl}/wp-json/wp/v2`;
const REVALIDATE_SECONDS = 3600;
// After this long without a new post the feed rotates older posts daily
// instead of listing the same "latest" ones.
const STALE_AFTER_DAYS = 45;

// WordPress category ids on blog.nishiki.icu.
const NEWS_CATEGORY = 20; // Daily Global Pulse, auto-generated; too noisy for the homepage.
const JAPANESE_CATEGORY = 24; // 明日海の日本語教室
// Posts about the internship stay on the blog but off the homepage.
const HIDDEN_POSTS = [783, 794];

const categoryNames: Record<number, string> = {
  1: "随笔",
  17: "玩机",
  18: "云服务器",
  19: "生活",
  21: "年度总结",
  24: "日语",
};

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  link: string;
  category: string;
};

export type BlogFeed = {
  posts: BlogPost[];
  stale: boolean;
};

export type JapaneseColumn = {
  link: string;
  lessons: number;
  recent: BlogPost[];
  // A different older lesson every day.
  review: BlogPost | null;
};

type RawPost = {
  id: number;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
};

const entities: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&nbsp;": " ",
  "&hellip;": "…",
  "&#8211;": "–",
  "&#8212;": "—",
  "&#8216;": "‘",
  "&#8217;": "’",
  "&#8220;": "“",
  "&#8221;": "”",
  "&#8230;": "…",
};

function toText(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&[#\w]+;/g, (entity) => entities[entity] ?? entity)
    .replace(/\[\s*…\s*\]|\[&hellip;\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function toPost(raw: RawPost): BlogPost {
  const categoryId = raw.categories.find((id) => id in categoryNames && id !== 1);
  return {
    id: raw.id,
    title: toText(raw.title.rendered),
    excerpt: toText(raw.excerpt.rendered),
    date: raw.date,
    link: raw.link,
    category: categoryNames[categoryId ?? 1],
  };
}

async function request(path: string) {
  const response = await fetch(`${API}${path}`, {
    next: { revalidate: REVALIDATE_SECONDS },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Blog API ${response.status}`);
  return response;
}

const fields = "_fields=id,date,link,title,excerpt,categories";

const DAY_MS = 86_400_000;

// Days since the epoch in Beijing time, so rotations change at local midnight.
function dayNumber() {
  return Math.floor((Date.now() + 8 * 3_600_000) / DAY_MS);
}

// Deterministic shuffle (mulberry32) so a given day always shows the same picks.
function shuffled<T>(items: T[], seed: number) {
  const result = [...items];
  let state = seed >>> 0;
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export async function getBlogFeed(count = 4): Promise<BlogFeed | null> {
  try {
    const response = await request(
      `/posts?per_page=20&categories_exclude=${NEWS_CATEGORY},${JAPANESE_CATEGORY}&exclude=${HIDDEN_POSTS.join(",")}&${fields}`,
    );
    const pool = ((await response.json()) as RawPost[]).map(toPost);
    const newest = pool[0] ? Date.parse(pool[0].date) : 0;
    const stale = Date.now() - newest > STALE_AFTER_DAYS * DAY_MS;
    if (!stale) return { posts: pool.slice(0, count), stale };
    const picks = shuffled(pool, dayNumber()).slice(0, count);
    picks.sort((a, b) => b.date.localeCompare(a.date));
    return { posts: picks, stale };
  } catch {
    return null;
  }
}

export async function getJapaneseColumn(): Promise<JapaneseColumn | null> {
  try {
    const response = await request(
      `/posts?per_page=100&categories=${JAPANESE_CATEGORY}&_fields=id,date,link,title,categories`,
    );
    const lessons = ((await response.json()) as RawPost[]).map((raw) =>
      toPost({ ...raw, excerpt: { rendered: "" } }),
    );
    const recent = lessons.slice(0, 3);
    const older = lessons.slice(3);
    const day = recent[0]?.title.match(/Day\s*(\d+)/i);
    return {
      link: `${profile.blogUrl}/category/%e6%98%8e%e6%97%a5%e6%b5%b7%e3%81%ae%e6%97%a5%e6%9c%ac%e8%aa%9e%e6%95%99%e5%ae%a4/`,
      lessons: day ? Number(day[1]) : Number(response.headers.get("x-wp-total") ?? 0),
      recent,
      review: older.length ? older[dayNumber() % older.length] : null,
    };
  } catch {
    return null;
  }
}
