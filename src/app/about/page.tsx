import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Rabbit } from "@/components/rabbit";

export const metadata: Metadata = {
  title: "關於老師",
  description: "認識 tutu 老師：兒童職能治療師，相信孩子會在遊戲裡長大。",
};

// 以下為示範內容，請 tutu 老師替換成實際的資歷與理念
const credentials = [
  "職能治療師證照（字號待填）",
  "○○大學 職能治療學系",
  "兒童發展中心臨床經驗 ○ 年",
  "感覺統合治療相關訓練認證",
];

const beliefs = [
  {
    title: "遊戲就是孩子的工作",
    body: "孩子透過玩來認識自己的身體、練習解決問題、學會與人相處。所以我的課程幾乎都長得像在玩，只是每個遊戲背後都有清楚的目標。",
  },
  {
    title: "家長是最重要的夥伴",
    body: "一週一次的課程改變有限，真正的進步發生在日常生活裡。我會把方法拆解成你在家就做得到的活動，讓練習自然融入生活。",
  },
  {
    title: "先看見孩子，再看見問題",
    body: "每個孩子的節奏不一樣。我會先花時間了解他喜歡什麼、害怕什麼，再決定要從哪裡開始。被理解的孩子，才願意嘗試。",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="關於老師" description="認識一下我，還有我怎麼看待孩子。" />

      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
          <div className="mx-auto w-40 md:w-48">
            <Rabbit happy className="w-full" />
          </div>

          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              我是 tutu 老師，一名兒童職能治療師。
              這段請換成你自己的介紹：你在哪裡執業、主要服務哪個年齡層的孩子、
              最擅長處理哪些狀況。
            </p>
            <p>
              第二段可以聊聊你為什麼走上這條路，或是某個讓你印象深刻的孩子。
              家長在選擇治療師時，往往是被這種真誠的東西打動，
              而不是一長串的資歷清單。
            </p>
          </div>
        </div>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">我相信的事</h2>
          <div className="mt-6 space-y-5">
            {beliefs.map((belief) => (
              <div
                key={belief.title}
                className="rounded-3xl border-2 border-border bg-card p-6"
              >
                <h3 className="text-xl font-bold">{belief.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {belief.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold">學經歷與證照</h2>
          <ul className="mt-6 space-y-3">
            {credentials.map((item) => (
              <li
                key={item}
                className="flex gap-3 rounded-2xl bg-muted/60 px-5 py-4 leading-relaxed"
              >
                <span className="text-accent" aria-hidden>
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
