import Link from "next/link";
import { Container } from "@/components/container";
import { GameCard } from "@/components/game-card";
import { Hero } from "@/components/hero";
import { Carrot } from "@/components/rabbit";
import { games } from "@/data/games";
import { services } from "@/data/services";

export default function HomePage() {
  return (
    <>
      <Hero />

      <Container className="py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">來玩遊戲吧</h2>
          <p className="mx-auto mt-3 max-w-lg text-lg leading-relaxed text-muted-foreground">
            每一款都是針對不同能力設計的，用手機、平板或電腦都可以玩。
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {games.map((game) => (
            <GameCard key={game.slug} game={game} />
          ))}
        </div>
      </Container>

      <div className="border-y-2 border-border bg-muted/40">
        <Container className="py-16">
          <div className="flex items-center gap-3">
            <Carrot className="size-9" />
            <h2 className="text-3xl font-bold">給家長的話</h2>
          </div>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            對孩子來說，遊戲不只是娛樂，而是他們認識世界的方式。
            這些小遊戲的設計都對應著具體的訓練目標，但對孩子而言，
            它們就只是好玩而已——這正是職能治療最理想的樣子。
          </p>

          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {services.slice(0, 2).map((service) => (
              <div
                key={service.slug}
                className="rounded-3xl border-2 border-border bg-card p-6"
              >
                <span className="text-4xl" aria-hidden>
                  {service.emoji}
                </span>
                <h3 className="mt-4 text-xl font-bold">{service.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {service.summary}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/services"
              className="rounded-2xl bg-accent px-7 py-4 font-bold text-accent-foreground transition-transform hover:scale-105"
            >
              看所有服務項目
            </Link>
            <Link
              href="/about"
              className="rounded-2xl border-2 border-border bg-card px-7 py-4 font-medium transition-colors hover:bg-muted"
            >
              認識 tutu 老師
            </Link>
          </div>
        </Container>
      </div>
    </>
  );
}
