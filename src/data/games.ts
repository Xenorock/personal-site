export type GameStatus = "ready" | "wip" | "planned";

export type Game = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  emoji: string;
  status: GameStatus;
  tags: string[];
};

export const games: Game[] = [
  {
    slug: "snake",
    title: "貪食蛇",
    tagline: "經典中的經典",
    description: "用 Canvas 重寫的貪食蛇，支援鍵盤與手機滑動操作，通關後可上傳分數。",
    emoji: "🐍",
    status: "planned",
    tags: ["Canvas", "鍵盤操作", "排行榜"],
  },
  {
    slug: "2048",
    title: "2048",
    tagline: "停不下來的數字滑塊",
    description: "純 React 狀態管理實作，含滑動動畫、復原一步與最佳分數紀錄。",
    emoji: "🔢",
    status: "planned",
    tags: ["React State", "動畫", "排行榜"],
  },
  {
    slug: "memory",
    title: "記憶翻牌",
    tagline: "考驗你的短期記憶",
    description: "限時翻牌配對，三種難度，計時與步數都會記進排行榜。",
    emoji: "🃏",
    status: "planned",
    tags: ["計時器", "動畫", "排行榜"],
  },
];

export const gameStatusLabel: Record<GameStatus, string> = {
  ready: "可以玩",
  wip: "開發中",
  planned: "規劃中",
};
