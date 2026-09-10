export const siteConfig = {
  name: "tutu 老師",
  title: "tutu 老師 — 個人網站",
  description: "我的作品集、技術筆記，還有幾款可以直接在瀏覽器裡玩的小遊戲。",
  // 之後綁定自訂網域後改成正式網址
  url: "https://personal-site-psi-woad.vercel.app",
  locale: "zh-TW",
  author: {
    name: "tutu 老師",
    github: "https://github.com/Xenorock",
    email: "",
  },
} as const;

export const navLinks = [
  { href: "/", label: "首頁" },
  { href: "/games", label: "遊戲" },
  { href: "/projects", label: "作品" },
  { href: "/blog", label: "文章" },
  { href: "/guestbook", label: "留言板" },
  { href: "/about", label: "關於" },
  { href: "/contact", label: "聯絡" },
] as const;
