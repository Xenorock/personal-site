import Link from "next/link";
import { gameStatusLabel, type Game } from "@/data/games";
import { cn } from "@/lib/utils";

export function GameCard({ game }: { game: Game }) {
  const playable = game.status === "ready";

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl" aria-hidden>
          {game.emoji}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-xs",
            playable
              ? "bg-accent text-accent-foreground"
              : "bg-muted text-muted-foreground",
          )}
        >
          {gameStatusLabel[game.status]}
        </span>
      </div>

      <h3 className="mt-4 font-semibold">{game.title}</h3>
      <p className="text-sm text-accent">{game.tagline}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {game.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {game.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </>
  );

  const className = cn(
    "block rounded-xl border border-border bg-card p-5 transition-all",
    playable
      ? "hover:-translate-y-0.5 hover:border-accent"
      : "opacity-70 cursor-not-allowed",
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
