export type Service = {
  slug: string;
  title: string;
  summary: string;
  details: string[];
  emoji: string;
};

// 內容為示範文案，實際服務項目與說明請依 tutu 老師的執業內容調整
export const services: Service[] = [
  {
    slug: "evaluation",
    title: "兒童發展評估",
    summary: "了解孩子目前的發展狀況，找出需要協助的地方。",
    details: [
      "感覺統合、精細動作、粗大動作的能力評估",
      "注意力、認知與學習準備度觀察",
      "評估後提供書面報告與具體建議",
    ],
    emoji: "📋",
  },
  {
    slug: "therapy",
    title: "個別療育課程",
    summary: "依孩子的狀況設計課程，用遊戲的方式進行訓練。",
    details: [
      "一對一課程，每次約 50 分鐘",
      "以遊戲為媒介，孩子在玩樂中練習目標能力",
      "定期回顧進度並調整課程方向",
    ],
    emoji: "🧩",
  },
  {
    slug: "consultation",
    title: "家長諮詢與居家指導",
    summary: "把治療室裡的方法帶回家，讓練習融入日常生活。",
    details: [
      "針對孩子的狀況提供居家活動建議",
      "討論日常照顧、生活自理與行為引導策略",
      "可線上進行，方便無法到場的家長",
    ],
    emoji: "🏠",
  },
  {
    slug: "school",
    title: "校園入班觀察",
    summary: "到幼兒園或學校觀察孩子在團體中的表現。",
    details: [
      "觀察孩子在團體情境中的適應與互動",
      "與老師溝通，討論班級中可行的協助方式",
      "提供教室環境與活動調整建議",
    ],
    emoji: "🏫",
  },
];
