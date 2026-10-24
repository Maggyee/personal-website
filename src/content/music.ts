// Bass videos. Add a Bilibili video by its BV id, or a self-hosted file under /public.
export type Video =
  | { title: string; date: string; bvid: string }
  | { title: string; date: string; src: string; poster?: string };

export const videos: Video[] = [];

export const bassStrings = [
  { name: "G", note: "G2", frequency: 98 },
  { name: "D", note: "D2", frequency: 73.42 },
  { name: "A", note: "A1", frequency: 55 },
  { name: "E", note: "E1", frequency: 41.2 },
] as const;
