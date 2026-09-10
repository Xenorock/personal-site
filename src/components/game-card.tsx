import Link from "next/link";
import { gameStatusLabel, skillLabel, skillStyle, type Game } from "@/data/games";
import { cn } from "@/lib/utils";

export function GameCard({ game }: { game: Game }) {
  const playable = game.status === "ready";
  const style = skillStyle[game.skill];

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex size-16 items-center justify-center rounded-2xl text-4xl",
            style.bg,
          )}
          aria-hidden
        >
          {game.emoji}
        </span>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-medium",
            style.bg,
            style.text,
          )}
        >
          {skillLabel[game.skill]}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-bold">{game.title}</h3>
      <p className={cn("mt-0.5 font-medium", style.text)}>{game.tagline}</p>
      <p className="mt-3 leading-relaxed text-muted-foreground">{game.howTo}</p>

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="rounded-full bg-muted px-3 py-1">{game.ageRange}</span>
        <span
          className={cn(
            "rounded-full px-3 py-1",
            playable ? "bg-accent font-medium text-accent-foreground" : "bg-muted",
          )}
        >
          {gameStatusLabel[game.status]}
        </span>
      </div>
    </>
  );

  const className = cn(
    "group block rounded-3xl border-2 border-border bg-card p-6 transition-all",
    playable
      ? cn("hover:-translate-y-1 hover:shadow-lg", style.ring)
      : "opacity-75",
  );

  if (!playable) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Link href={`/games/${game.slug}`} className={className}>
      {content}
    </Link>
  );
}
