import type { Metadata } from "next";
import { Container } from "@/components/container";
import { GameCard } from "@/components/game-card";
import { PageHeader } from "@/components/page-header";
import { games, skillLabel, skillStyle } from "@/data/games";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "遊戲區",
  description:
    "免費的兒童互動小遊戲，針對手眼協調、認知記憶、精細動作與專注力設計，手機平板都能玩。",
};

export default function GamesPage() {
  return (
    <>
      <PageHeader
        title="遊戲區"
        description="挑一個喜歡的開始玩吧！每一款都不用下載，也不用註冊。"
      />

      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>

        <section className="mt-16 rounded-3xl border-2 border-border bg-muted/40 p-7">
          <h2 className="text-2xl font-bold">這些遊戲在練什麼？</h2>
          <p className="mt-2 leading-relaxed text-muted-foreground">
            給家長的說明。每款遊戲背後都有對應的訓練目標，孩子玩的時候不需要知道，
            但了解這些能幫助你觀察孩子的表現。
          </p>

          <dl className="mt-7 space-y-6">
            {games.map((game) => (
              <div key={game.slug}>
                <dt className="flex flex-wrap items-center gap-2">
                  <span aria-hidden>{game.emoji}</span>
                  <span className="font-bold">{game.title}</span>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-sm",
                      skillStyle[game.skill].bg,
                      skillStyle[game.skill].text,
                    )}
                  >
                    {skillLabel[game.skill]}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    建議 {game.ageRange}
                  </span>
                </dt>
                <dd className="mt-1.5 leading-relaxed text-muted-foreground">
                  {game.goal}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
            提醒：這些遊戲是輔助練習與親子互動的工具，不能取代專業評估與治療。
            如果你對孩子的發展有疑慮，歡迎預約諮詢。
          </p>
        </section>
      </Container>
    </>
  );
}
