export const siteConfig = {
  name: "tutu 老師",
  shortName: "tutu",
  title: "tutu 老師 — 兒童職能治療",
  tagline: "陪孩子在遊戲裡長大",
  description:
    "兒童職能治療師 tutu 老師的線上空間。這裡有免費的互動小遊戲，陪孩子練手眼協調、專注力與小手肌肉，也有給家長的療育資訊。",
  // 在 Vercel Settings → Domains 綁定後同步更新
  url: "https://ot-rabbit-play.vercel.app",
  locale: "zh-TW",
  author: {
    name: "tutu 老師",
    role: "兒童職能治療師",
    github: "https://github.com/Xenorock",
    email: "",
  },
} as const;

export const navLinks = [
  { href: "/games", label: "遊戲區" },
  { href: "/about", label: "關於老師" },
  { href: "/services", label: "服務項目" },
  { href: "/articles", label: "家長園地" },
  // 預約諮詢暫不對外開放，日後啟用時把這行加回來：
  // { href: "/booking", label: "預約諮詢" },
] as const;
