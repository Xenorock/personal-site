import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ColorQuest } from "@/components/games/color-quest";
import { GameShell } from "@/components/games/game-shell";
import { getGame } from "@/data/games";

const game = getGame("color-quest");

export const metadata: Metadata = {
  title: "顏色大冒險",
  description:
    "丟五顆彩色骰子，排出使用顏色的順序，讓兔子繞棋盤一圈回家。訓練孩子的計劃能力與執行功能。",
};

export default function ColorQuestPage() {
  if (!game) notFound();

  return (
    <GameShell game={game}>
      <ColorQuest />
    </GameShell>
  );
}
