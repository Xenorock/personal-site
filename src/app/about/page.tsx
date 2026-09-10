import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { Rabbit } from "@/components/rabbit";

export const metadata: Metadata = {
  title: "關於老師",
  description:
    "tutu 老師，長庚大學職能治療學系畢業，八年兒童職能治療經驗，走過診所、醫院、自費體系與學校系統。",
};

const credentials = [
  "長庚大學 職能治療學系",
  "職能治療師執照",
  "兒童職能治療臨床經驗 8 年",
  "服務場域涵蓋診所、醫院、自費體系與學校系統",
];

const beliefs = [
  {
    title: "在玩中學",
    body: "孩子透過玩來認識自己的身體、練習解決問題、學會與人相處。所以我的課程幾乎都長得像在玩，只是每一個遊戲背後，都有清楚的訓練目標。刺激不需要多，只要設計對了，孩子自然會投入。",
  },
  {
    title: "打破距離的限制",
    body: "需要幫助的孩子，不一定住在資源充足的地方。把方法做成打開就能玩的遊戲，是我目前想到最直接的方式——不管你在哪裡，都能開始。",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="關於老師" description="認識一下我，還有我為什麼做這個網站。" />

      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
          <div className="mx-auto w-40 md:w-48">
            <Rabbit happy className="w-full" />
          </div>

          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              我畢業於長庚大學職能治療學系，在兒童治療這條路上走了八年。
              診所、醫院、自費體系、學校系統都待過，
              也因此看見很多不一樣的家庭與孩子。
            </p>
            <p>
              走得越久，越常想起兩件事。一是需要幫助的孩子，
              不一定住在資源充足的地方；願意陪孩子練習的家長，
              也常常不知道能從哪裡開始。二是市面上的 3C 內容
              多半靠強烈的聲光刺激抓住注意力，孩子玩得越久，反而越難靜下來。
            </p>
            <p>
              所以有了這個網站。我想把治療室裡用的方法，
              做成孩子在家、在偏鄉都能打開就玩的遊戲。刺激不需要多，
              只要設計對了，孩子自然會投入，能力也會在一次又一次的遊玩裡慢慢長出來。
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
          <h2 className="text-2xl font-bold">學經歷</h2>
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
