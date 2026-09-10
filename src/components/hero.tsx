"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/container";
import { Rabbit } from "@/components/rabbit";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const HAPPY_DURATION = 1500;

export function Hero() {
  const rabbitRef = useRef<HTMLDivElement>(null);
  const [look, setLook] = useState({ x: 0, y: 0 });
  const [happy, setHappy] = useState(false);

  // 讓兔子的視線追著游標，用 rAF 節流避免每次移動都重新渲染
  useEffect(() => {
    let frame = 0;

    function handleMove(event: PointerEvent) {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = rabbitRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        setLook({
          x: (event.clientX - centerX) / (rect.width * 1.5),
          y: (event.clientY - centerY) / (rect.height * 1.5),
        });
      });
    }

    window.addEventListener("pointermove", handleMove);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!happy) return;
    const timer = setTimeout(() => setHappy(false), HAPPY_DURATION);
    return () => clearTimeout(timer);
  }, [happy]);

  return (
    <div className="border-b-2 border-border bg-muted/40">
      <Container className="grid items-center gap-10 py-16 sm:py-24 md:grid-cols-[1fr_auto]">
        <div>
          <p className="font-medium text-accent">{siteConfig.author.role}</p>
          <h1 className="mt-3 text-4xl leading-tight font-bold sm:text-5xl">
            哈囉，我是 {siteConfig.name}
          </h1>
          <p className="mt-4 text-2xl font-medium text-muted-foreground">
            {siteConfig.tagline}
          </p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            這裡有幾款我設計的小遊戲，陪孩子練手眼協調、專注力和小手肌肉。
            不用下載、不用註冊，打開就能玩。
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/games"
              className="rounded-2xl bg-accent px-7 py-4 text-lg font-bold text-accent-foreground shadow-sm transition-transform hover:scale-105"
            >
              🎮 開始玩遊戲
            </Link>
            <Link
              href="/services"
              className="rounded-2xl border-2 border-border bg-card px-7 py-4 text-lg font-medium transition-colors hover:bg-muted"
            >
              家長看這裡
            </Link>
          </div>
        </div>

        <div
          ref={rabbitRef}
          onClick={() => setHappy(true)}
          className="mx-auto w-48 cursor-pointer sm:w-64"
          role="button"
          tabIndex={0}
          aria-label="摸摸兔子"
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setHappy(true);
            }
          }}
        >
          <Rabbit
            lookX={look.x}
            lookY={look.y}
            happy={happy}
            className={cn(
              "w-full transition-transform duration-300",
              happy ? "-translate-y-3 scale-105" : "hover:scale-105",
            )}
          />
          <p className="mt-3 text-center text-sm text-muted-foreground">
            {happy ? "耶！你摸到我了 🥕" : "摸摸看牠會怎樣"}
          </p>
        </div>
      </Container>
    </div>
  );
}
