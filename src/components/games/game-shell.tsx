import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/container";
import { skillLabel, skillStyle, type Game } from "@/data/games";
import { cn } from "@/lib/utils";

export function GameShell({
  game,
  children,
}: {
  game: Game;
  children: ReactNode;
}) {
  const style = skillStyle[game.skill];

  return (
    <Container className="py-10">
      <Link
        href="/games"
        className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        回遊戲區
      </Link>

      <header className="mt-6 flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "flex size-14 items-center justify-center rounded-2xl text-3xl",
            style.bg,
          )}
          aria-hidden
        >
          {game.emoji}
        </span>
        <div>
          <h1 className="text-3xl font-bold">{game.title}</h1>
          <p className={cn("font-medium", style.text)}>{game.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <span
            className={cn("rounded-full px-3 py-1 text-sm", style.bg, style.text)}
          >
            {skillLabel[game.skill]}
          </span>
          <span className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            {game.ageRange}
          </span>
        </div>
      </header>

      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        {game.howTo}
      </p>

      <div className="mt-8">{children}</div>

      <section className="mt-14 rounded-3xl border-2 border-border bg-muted/40 p-6 sm:p-7">
        <h2 className="text-xl font-bold">給家長：這款在練什麼</h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{game.goal}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          這款遊戲是輔助練習與親子互動的工具，不能取代專業評估與治療。
          陪玩時的鼓勵比分數重要，孩子卡住的時候可以先降低難度。
        </p>
      </section>
    </Container>
  );
}
