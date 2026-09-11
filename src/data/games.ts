export type Skill = "eyehand" | "cognitive" | "fine" | "attention";
export type GameStatus = "ready" | "wip" | "planned";

export type Game = {
  slug: string;
  title: string;
  tagline: string;
  /** 給孩子看的一句話玩法說明 */
  howTo: string;
  /** 給家長看的訓練目標 */
  goal: string;
  emoji: string;
  skill: Skill;
  status: GameStatus;
  ageRange: string;
};

export const skillLabel: Record<Skill, string> = {
  eyehand: "手眼協調",
  cognitive: "認知記憶",
  fine: "精細動作",
  attention: "專注力",
};

export const skillStyle: Record<Skill, { text: string; bg: string; ring: string }> = {
  eyehand: {
    text: "text-eyehand",
    bg: "bg-eyehand/12",
    ring: "group-hover:border-eyehand",
  },
  cognitive: {
    text: "text-cognitive",
    bg: "bg-cognitive/12",
    ring: "group-hover:border-cognitive",
  },
  fine: {
    text: "text-fine",
    bg: "bg-fine/12",
    ring: "group-hover:border-fine",
  },
  attention: {
    text: "text-attention",
    bg: "bg-attention/12",
    ring: "group-hover:border-attention",
  },
};

export const gameStatusLabel: Record<GameStatus, string> = {
  ready: "可以玩了",
  wip: "製作中",
  planned: "即將登場",
};

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}

export const games: Game[] = [
  {
    slug: "carrot-catch",
    title: "紅蘿蔔快打",
    tagline: "看到紅蘿蔔就點它！",
    howTo: "紅蘿蔔會從洞裡冒出來，看到就趕快點一下，看你能抓到幾根。",
    goal: "訓練視覺搜尋、反應速度與手眼協調，並在限時情境下練習持續注意力。",
    emoji: "🥕",
    skill: "eyehand",
    status: "planned",
    ageRange: "3 歲以上",
  },
  {
    slug: "memory-pairs",
    title: "記憶翻翻樂",
    tagline: "找出一模一樣的兩張卡",
    howTo: "翻開卡片，記住圖案的位置，把相同的兩張配成一對。",
    goal: "訓練視覺記憶、短期工作記憶與配對概念，難度可依孩子能力調整卡片數量。",
    emoji: "🃏",
    skill: "cognitive",
    status: "ready",
    ageRange: "4 歲以上",
  },
  {
    slug: "sort-basket",
    title: "分類小幫手",
    tagline: "把東西放進對的籃子",
    howTo: "用手指把水果和玩具拖到正確的籃子裡，全部分好就過關。",
    goal: "訓練拖曳時的手部控制與抓放穩定度，同時建立物品分類與歸納的認知能力。",
    emoji: "🧺",
    skill: "fine",
    status: "planned",
    ageRange: "3 歲以上",
  },
  {
    slug: "odd-one-out",
    title: "找出不一樣",
    tagline: "誰跟大家不一樣？",
    howTo: "畫面上有很多相似的圖案，找出唯一不一樣的那一個，點它。",
    goal: "訓練視覺區辨、選擇性注意力與抑制控制，避免被相似干擾物吸引。",
    emoji: "🔍",
    skill: "attention",
    status: "planned",
    ageRange: "4 歲以上",
  },
];
