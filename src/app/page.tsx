import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/container";
import { GameCard } from "@/components/game-card";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";
import { games } from "@/data/games";
import { projects } from "@/data/projects";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Container className="py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">小遊戲</h2>
          <Link
            href="/games"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            全部遊戲
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </Container>

      <Container className="py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight">近期作品</h2>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            全部作品
            <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>

      <Container className="pb-24">
        <div className="rounded-xl border border-border bg-card p-8 text-center">
          <h2 className="text-xl font-bold tracking-tight">想聊聊嗎？</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            不管是合作邀約、技術討論，還是純粹想留個腳印，都很歡迎。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              寄訊息給我
            </Link>
            <Link
              href="/guestbook"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              去留言板
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
