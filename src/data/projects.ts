export type Project = {
  slug: string;
  title: string;
  description: string;
  year: string;
  tags: string[];
  repo?: string;
  link?: string;
};

// 暫時的示範資料，階段 4 之後改由資料庫與後台管理
export const projects: Project[] = [
  {
    slug: "personal-site",
    title: "個人網站",
    description:
      "你正在看的這個網站。Next.js 全端、Postgres 資料庫，內建幾款可以直接玩的小遊戲。",
    year: "2026",
    tags: ["Next.js", "TypeScript", "Tailwind", "Postgres"],
    repo: "https://github.com/Xenorock",
  },
  {
    slug: "placeholder-a",
    title: "作品名稱待填",
    description: "把你的專案簡介寫在這裡，說明它解決什麼問題、你負責哪些部分。",
    year: "2025",
    tags: ["待補"],
  },
  {
    slug: "placeholder-b",
    title: "作品名稱待填",
    description: "第二個示範項目，之後可以在後台直接新增與編輯，不需要改程式碼。",
    year: "2025",
    tags: ["待補"],
  },
];
