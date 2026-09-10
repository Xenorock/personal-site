import type { Metadata } from "next";
import { Container } from "@/components/container";
import { GameCard } from "@/components/game-card";
import { PageHeader } from "@/components/page-header";
import { games } from "@/data/games";

export const metadata: Metadata = {
  title: "小遊戲",
  description: "幾款可以直接在瀏覽器裡玩的小遊戲，不用註冊也不用下載。",
};

export default function GamesPage() {
  return (
    <>
      <PageHeader
        title="小遊戲"
        description="打開就能玩，手機和電腦都支援。破紀錄之後可以把分數留在排行榜上。"
      />
      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </Container>
    </>
  );
}
