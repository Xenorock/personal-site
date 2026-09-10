"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Gamepad2 } from "lucide-react";
import { Container } from "@/components/container";

const ROLES = ["寫程式的人", "遊戲玩家", "終身學習者"];

const TYPE_SPEED = 130;
const DELETE_SPEED = 60;
const HOLD_DURATION = 1600;

type TypingState = {
  roleIndex: number;
  charCount: number;
  deleting: boolean;
};

// 打完整個詞就停一下再開始刪除，刪完則換下一個詞
function nextTypingState(state: TypingState): TypingState {
  const word = ROLES[state.roleIndex];

  if (!state.deleting && state.charCount === word.length) {
    return { ...state, deleting: true };
  }

  if (state.deleting && state.charCount === 0) {
    return {
      roleIndex: (state.roleIndex + 1) % ROLES.length,
      charCount: 0,
      deleting: false,
    };
  }

  return { ...state, charCount: state.charCount + (state.deleting ? -1 : 1) };
}

export function Hero() {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState<TypingState>({
    roleIndex: 0,
    charCount: 0,
    deleting: false,
  });

  useEffect(() => {
    const word = ROLES[typing.roleIndex];
    const finishedWord = !typing.deleting && typing.charCount === word.length;
    const delay = finishedWord
      ? HOLD_DURATION
      : typing.deleting
        ? DELETE_SPEED
        : TYPE_SPEED;

    const timer = setTimeout(() => setTyping(nextTypingState), delay);
    return () => clearTimeout(timer);
  }, [typing]);

  // 讓光暈跟著游標，座標透過 CSS 變數傳給背景層，避免每次移動都重新渲染
  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const surface = surfaceRef.current;
    if (!surface) return;
    const rect = surface.getBoundingClientRect();
    surface.style.setProperty("--pointer-x", `${event.clientX - rect.left}px`);
    surface.style.setProperty("--pointer-y", `${event.clientY - rect.top}px`);
  }

  return (
    <div
      ref={surfaceRef}
      onPointerMove={handlePointerMove}
      className="group relative overflow-hidden border-b border-border"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), color-mix(in oklch, var(--accent) 20%, transparent), transparent 70%)",
        }}
      />

      <Container className="relative py-24 sm:py-32">
        <p className="font-mono text-sm text-accent">$ whoami</p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
          嗨，我是 tutu 老師
        </h1>

        <p className="mt-4 text-xl text-muted-foreground sm:text-2xl">
          一個{" "}
          <span className="font-medium text-foreground">
            {ROLES[typing.roleIndex].slice(0, typing.charCount)}
          </span>
          <span className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[0.15em] animate-pulse bg-accent align-middle" />
        </p>

        <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
          這裡放我的作品與技術筆記，也放幾款我自己寫的小遊戲。
          不用註冊、不用下載，打開就能玩。
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            <Gamepad2 className="size-4" />
            去玩遊戲
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
          >
            看看作品
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}
