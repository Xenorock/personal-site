"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Carrot, Rabbit } from "@/components/rabbit";
import { playFlip, playMatch, playWin } from "@/lib/sound";
import { cn } from "@/lib/utils";

type Card = { id: number; symbol: string; matched: boolean };

const THEMES = {
  animals: { label: "動物", symbols: ["🐶", "🐱", "🐰", "🐻", "🐼", "🐨", "🦊", "🐯"] },
  fruits: { label: "水果", symbols: ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍑", "🥝"] },
  vehicles: { label: "車子", symbols: ["🚗", "🚌", "🚑", "🚒", "🚕", "🚜", "🚲", "✈️"] },
} as const;

type ThemeKey = keyof typeof THEMES;

const LEVELS = [
  { label: "簡單", pairs: 3, cols: "grid-cols-3", hint: "6 張卡片" },
  { label: "中等", pairs: 6, cols: "grid-cols-3 sm:grid-cols-4", hint: "12 張卡片" },
  { label: "挑戰", pairs: 8, cols: "grid-cols-4", hint: "16 張卡片" },
] as const;

const PRAISES = ["找到了！", "太棒了！", "好眼力！", "配對成功！", "記憶力真好！"];

const MATCH_DELAY = 450;
const MISS_DELAY = 850;

function createDeck(theme: ThemeKey, pairs: number): Card[] {
  const symbols = THEMES[theme].symbols.slice(0, pairs);
  const deck = [...symbols, ...symbols].map((symbol, index) => ({
    id: index,
    symbol,
    matched: false,
  }));

  // Fisher-Yates 洗牌
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function MemoryPairs() {
  const [theme, setTheme] = useState<ThemeKey>("animals");
  const [levelIndex, setLevelIndex] = useState(0);
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const [soundOn, setSoundOn] = useState(true);

  const level = LEVELS[levelIndex];
  // 由牌面直接推導勝利狀態，不另外用 state 保存
  const won = playing && cards.length > 0 && cards.every((card) => card.matched);

  const soundOnRef = useRef(soundOn);
  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  // 牌組在使用者按下開始時才建立，避免伺服器與客戶端洗出不同結果
  function start(nextLevel = levelIndex, nextTheme = theme) {
    setLevelIndex(nextLevel);
    setTheme(nextTheme);
    setCards(createDeck(nextTheme, LEVELS[nextLevel].pairs));
    setFlipped([]);
    setMoves(0);
    setElapsed(0);
    setMessage("");
    setPlaying(true);
  }

  function handleFlip(index: number) {
    if (flipped.length >= 2 || flipped.includes(index) || cards[index].matched) {
      return;
    }

    if (soundOn) playFlip();

    const next = [...flipped, index];
    setFlipped(next);
    if (next.length === 2) setMoves((m) => m + 1);
  }

  // 翻開兩張後判定是否成對，狀態更新都放在計時器回呼裡
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [a, b] = flipped;
    const isMatch = cards[a]?.symbol === cards[b]?.symbol;

    const timer = setTimeout(
      () => {
        if (isMatch) {
          setCards((prev) =>
            prev.map((card, index) =>
              index === a || index === b ? { ...card, matched: true } : card,
            ),
          );
          setMessage(PRAISES[Math.floor(Math.random() * PRAISES.length)]);
          if (soundOnRef.current) playMatch();
        }
        setFlipped([]);
      },
      isMatch ? MATCH_DELAY : MISS_DELAY,
    );

    return () => clearTimeout(timer);
  }, [flipped, cards]);

  useEffect(() => {
    if (!playing || won) return;
    const timer = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [playing, won]);

  useEffect(() => {
    if (won && soundOnRef.current) playWin();
  }, [won]);

  if (!playing) {
    return (
      <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8">
        <fieldset>
          <legend className="text-xl font-bold">選一個主題</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setTheme(key)}
                aria-pressed={theme === key}
                className={cn(
                  "rounded-2xl border-2 p-4 text-lg font-medium transition-colors",
                  theme === key
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-muted",
                )}
              >
                <span className="text-2xl" aria-hidden>
                  {THEMES[key].symbols.slice(0, 3).join(" ")}
                </span>
                <span className="mt-1 block">{THEMES[key].label}</span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-8">
          <legend className="text-xl font-bold">選難度</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {LEVELS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setLevelIndex(index)}
                aria-pressed={levelIndex === index}
                className={cn(
                  "rounded-2xl border-2 p-4 text-lg font-medium transition-colors",
                  levelIndex === index
                    ? "border-accent bg-accent/10"
                    : "border-border hover:bg-muted",
                )}
              >
                {item.label}
                <span className="mt-1 block text-sm text-muted-foreground">
                  {item.hint}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="button"
          onClick={() => start()}
          className="mt-8 w-full rounded-2xl bg-accent px-7 py-5 text-xl font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
        >
          開始玩 🎮
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-border bg-card px-5 py-4">
        <p className="text-lg">
          步數 <span className="font-bold">{moves}</span>
        </p>
        <p className="text-lg">
          時間 <span className="font-bold tabular-nums">{formatTime(elapsed)}</span>
        </p>
        <p className="text-lg">
          找到 <span className="font-bold">{cards.filter((c) => c.matched).length / 2}</span>
          {" / "}
          {level.pairs}
        </p>

        <div className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setSoundOn((value) => !value)}
            aria-label={soundOn ? "關閉音效" : "開啟音效"}
            className="inline-flex size-11 items-center justify-center rounded-xl border-2 border-border transition-colors hover:bg-muted"
          >
            {soundOn ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
          </button>
          <button
            type="button"
            onClick={() => start()}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2.5 font-medium transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-5" />
            重來
          </button>
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-4 min-h-8 text-center text-lg font-bold text-accent"
      >
        {won ? "" : message}
      </p>

      {won && (
        <div className="mb-6 rounded-3xl border-2 border-accent bg-accent/10 p-6 text-center">
          <div className="mx-auto w-28">
            <Rabbit happy className="w-full" />
          </div>
          <p className="mt-3 text-2xl font-bold">你全部找到了！</p>
          <p className="mt-2 text-lg text-muted-foreground">
            用了 {moves} 步，花了 {formatTime(elapsed)}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => start()}
              className="rounded-2xl bg-accent px-7 py-4 text-lg font-bold text-accent-foreground transition-transform hover:scale-105"
            >
              再玩一次
            </button>
            <button
              type="button"
              onClick={() => setPlaying(false)}
              className="rounded-2xl border-2 border-border bg-card px-7 py-4 text-lg font-medium transition-colors hover:bg-muted"
            >
              換主題或難度
            </button>
          </div>
        </div>
      )}

      <div className={cn("mx-auto grid max-w-xl gap-3", level.cols)}>
        {cards.map((card, index) => {
          const open = card.matched || flipped.includes(index);

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleFlip(index)}
              disabled={open || flipped.length >= 2}
              aria-label={open ? `已翻開的卡片：${card.symbol}` : "蓋著的卡片，點一下翻開"}
              className="card-scene aspect-square disabled:cursor-default"
            >
              <span className={cn("card-inner", open && "is-flipped")}>
                <span className="card-face border-2 border-border bg-muted">
                  <Carrot className="size-1/2 opacity-60" />
                </span>
                <span
                  className={cn(
                    "card-face card-face-back border-2 text-4xl sm:text-5xl",
                    card.matched ? "border-fine bg-fine/15" : "border-accent bg-card",
                  )}
                >
                  {card.symbol}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
