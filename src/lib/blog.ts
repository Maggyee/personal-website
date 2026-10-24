import { profile } from "@/content/profile";

const API = `${profile.blogUrl}/wp-json/wp/v2`;
const REVALIDATE_SECONDS = 3600;

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

export type JapaneseColumn = {
  link: string;
  lessons: number;
  recent: BlogPost[];
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

export async function getRecentPosts(count = 4): Promise<BlogPost[] | null> {
  try {
    const response = await request(
      `/posts?per_page=${count}&categories_exclude=${NEWS_CATEGORY},${JAPANESE_CATEGORY}&exclude=${HIDDEN_POSTS.join(",")}&${fields}`,
    );
    return ((await response.json()) as RawPost[]).map(toPost);
  } catch {
    return null;
  }
}

export async function getJapaneseColumn(): Promise<JapaneseColumn | null> {
  try {
    const response = await request(
      `/posts?per_page=3&categories=${JAPANESE_CATEGORY}&${fields}`,
    );
    const recent = ((await response.json()) as RawPost[]).map(toPost);
    const day = recent[0]?.title.match(/Day\s*(\d+)/i);
    return {
      link: `${profile.blogUrl}/category/%e6%98%8e%e6%97%a5%e6%b5%b7%e3%81%ae%e6%97%a5%e6%9c%ac%e8%aa%9e%e6%95%99%e5%ae%a4/`,
      lessons: day ? Number(day[1]) : Number(response.headers.get("x-wp-total") ?? 0),
      recent,
    };
  } catch {
    return null;
  }
}
