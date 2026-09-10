export type Service = {
  slug: string;
  title: string;
  summary: string;
  details: string[];
  emoji: string;
};

export const services: Service[] = [
  {
    slug: "evaluation",
    title: "發展評估",
    summary: "先了解孩子現在的位置，才知道下一步要往哪裡走。",
    details: [
      "感覺統合、精細動作、粗大動作的能力評估",
      "注意力、認知與學習準備度的觀察",
      "評估後與家長說明結果，並提供後續方向建議",
    ],
    emoji: "📋",
  },
  {
    slug: "therapy",
    title: "個別療育",
    summary: "依孩子的狀況設計活動，讓訓練藏在遊戲裡。",
    details: [
      "一對一進行，依評估結果設定訓練目標",
      "以遊戲為媒介，孩子在玩的過程中練習目標能力",
      "定期回顧進度，隨孩子的變化調整課程內容",
    ],
    emoji: "🧩",
  },
  {
    slug: "consultation",
    title: "家長／親師諮詢",
    summary: "把治療室裡的方法，帶回家裡和教室裡。",
    details: [
      "討論孩子在家庭或校園中遇到的狀況與應對方式",
      "提供在家、在教室都能執行的活動與環境調整建議",
      "親師之間的溝通與合作討論",
    ],
    emoji: "🏠",
  },
];
