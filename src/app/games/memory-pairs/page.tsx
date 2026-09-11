import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameShell } from "@/components/games/game-shell";
import { MemoryPairs } from "@/components/games/memory-pairs";
import { getGame } from "@/data/games";

const game = getGame("memory-pairs");

export const metadata: Metadata = {
  title: "記憶翻翻樂",
  description:
    "翻開卡片記住圖案位置，把相同的兩張配成一對。三種主題、三段難度，訓練孩子的視覺記憶與配對能力。",
};

export default function MemoryPairsPage() {
  if (!game) notFound();

  return (
    <GameShell game={game}>
      <MemoryPairs />
    </GameShell>
  );
}
