"use client";

import { useEffect, useState } from "react";
import { Dices, RotateCcw, Undo2, Volume2, VolumeX } from "lucide-react";
import { Rabbit } from "@/components/rabbit";
import {
  addObstacle,
  BASE_DICE,
  COLORS,
  createBoard,
  resolvePlan,
  rollDice,
  type Cell,
  type ChanceKind,
  type Step,
} from "@/lib/color-quest";
import { playFlip, playMatch, playWin } from "@/lib/sound";
import { cn } from "@/lib/utils";

type Phase = "idle" | "planning" | "moving" | "chance" | "won";

const MOVE_INTERVAL = 650;

const CHANCE_CARDS: Record<
  ChanceKind,
  { title: string; body: string; emoji: string }
> = {
  extraDice: {
    title: "多一顆骰子！",
    body: "下一回合可以丟六顆骰子，能多走一步。",
    emoji: "🎲",
  },
  repeatColor: {
    title: "顏色可以用兩次！",
    body: "下一回合有一個顏色可以重複使用，等於多走一步。",
    emoji: "🔁",
  },
  obstacle: {
    title: "前面出現路障！",
    body: "前方多了一個路障，兔子經過時會自動繞過它。",
    emoji: "🚧",
  },
};

const CHANCE_KINDS = Object.keys(CHANCE_CARDS) as ChanceKind[];

// 一回合五顆骰子大約能走 25 格，所以用圈數來控制一局的長度與規劃難度
const LEVELS = [
  { label: "散步", laps: 1, hint: "繞 1 圈" },
  { label: "遠足", laps: 2, hint: "繞 2 圈" },
  { label: "大冒險", laps: 3, hint: "繞 3 圈" },
] as const;

// 回合數越少代表規劃得越好
function rateStars(rounds: number, laps: number) {
  if (rounds <= laps) return 3;
  if (rounds <= laps + 1) return 2;
  return 1;
}

export function ColorQuest() {
  const [board, setBoard] = useState<Cell[]>([]);
  const [position, setPosition] = useState(0);
  const [progress, setProgress] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [dice, setDice] = useState<ReturnType<typeof rollDice>>([]);
  const [plan, setPlan] = useState<number[]>([]);
  const [pending, setPending] = useState<Step[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [card, setCard] = useState<ChanceKind | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  // 預設「遠足」：繞 1 圈常常一回合就結束，機會卡來不及發揮作用
  const [levelIndex, setLevelIndex] = useState(1);

  // allowRepeat 是這一回合生效的效果，nextBonus / nextRepeat 要等下一回合才套用
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [nextBonus, setNextBonus] = useState(0);
  const [nextRepeat, setNextRepeat] = useState(false);

  const laps = LEVELS[levelIndex].laps;
  const lapTarget = board.length * laps;
  const currentLap = board.length
    ? Math.min(Math.floor(progress / board.length) + 1, laps)
    : 1;
  const planSize = dice.length + (allowRepeat ? 1 : 0);
  const maxPerDice = allowRepeat ? 2 : 1;

  function playIfOn(play: () => void) {
    if (soundOn) play();
  }

  // 棋盤與骰子都在使用者按下開始後才產生，避免伺服器與客戶端結果不一致
  function startGame() {
    setBoard(createBoard());
    setPosition(0);
    setProgress(0);
    setRounds(1);
    setDice(rollDice(BASE_DICE));
    setPlan([]);
    setPending([]);
    setCard(null);
    setAllowRepeat(false);
    setNextBonus(0);
    setNextRepeat(false);
    setPhase("planning");
  }

  // 預設讀目前待生效的效果；剛抽到卡時由呼叫端帶入，避免讀到還沒更新的狀態
  function startRound(bonus = nextBonus, repeat = nextRepeat) {
    setDice(rollDice(BASE_DICE + bonus));
    setAllowRepeat(repeat);
    setNextBonus(0);
    setNextRepeat(false);
    setPlan([]);
    setRounds((value) => value + 1);
    setPhase("planning");
  }

  function addToPlan(diceIndex: number) {
    const used = plan.filter((item) => item === diceIndex).length;
    if (plan.length >= planSize || used >= maxPerDice) return;
    playIfOn(playFlip);
    setPlan([...plan, diceIndex]);
  }

  function departure() {
    if (plan.length !== planSize) return;
    setPending(resolvePlan(board, position, plan, dice));
    setPhase("moving");
  }

  // 依序執行規劃好的每一步，狀態更新都放在計時器回呼裡
  useEffect(() => {
    if (phase !== "moving" || pending.length === 0) return;

    const timer = setTimeout(() => {
      const [step, ...rest] = pending;
      const landed = step.target;
      const nextProgress = progress + step.distance;

      if (landed !== null) {
        setPosition(landed);
        setProgress(nextProgress);
        playIfOn(playFlip);
      }

      setPending(rest);

      if (nextProgress >= lapTarget) {
        setPhase("won");
        playIfOn(playWin);
        return;
      }

      if (landed !== null && board[landed]?.type === "chance") {
        setCard(CHANCE_KINDS[Math.floor(Math.random() * CHANCE_KINDS.length)]);
        setPhase("chance");
        playIfOn(playMatch);
        return;
      }

      if (rest.length === 0) startRound();
    }, MOVE_INTERVAL);

    return () => clearTimeout(timer);
    // 只由 phase 與 pending 驅動；每次重新執行時其餘值都是最新的
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pending]);

  function confirmCard() {
    if (!card) return;

    let bonus = nextBonus;
    let repeat = nextRepeat;

    if (card === "extraDice") bonus = 1;
    if (card === "repeatColor") repeat = true;
    if (card === "obstacle") setBoard((prev) => addObstacle(prev, position));

    setCard(null);

    // 這回合還沒走完，先記下效果，等回合結束才套用
    if (pending.length > 0) {
      setNextBonus(bonus);
      setNextRepeat(repeat);
      setPhase("moving");
      return;
    }

    startRound(bonus, repeat);
  }

  if (phase === "idle") {
    return (
      <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold">怎麼玩</h2>
        <ol className="mt-4 space-y-3 text-lg leading-relaxed text-muted-foreground">
          <li>
            <span className="font-bold text-foreground">1.</span>{" "}
            每回合會丟出五顆彩色骰子。
          </li>
          <li>
            <span className="font-bold text-foreground">2.</span> 點骰子排出順序。
            每個顏色會讓兔子走到
            <strong className="text-foreground">前方最近的同色格子</strong>。
          </li>
          <li>
            <span className="font-bold text-foreground">3.</span>{" "}
            順序不一樣，走的距離就不一樣——先想好再出發！
          </li>
          <li>
            <span className="font-bold text-foreground">4.</span> 踩到 ⭐ 會拿到機會卡，
            繞完指定圈數就過關。
          </li>
        </ol>

        <fieldset className="mt-8">
          <legend className="text-xl font-bold">要走多遠？</legend>
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

        <p className="mt-5 text-muted-foreground">
          用越少回合走完，得到的星星越多。想拿三顆星就得好好安排順序。
        </p>

        <button
          type="button"
          onClick={startGame}
          className="mt-6 w-full rounded-2xl bg-accent px-7 py-5 text-xl font-bold text-accent-foreground transition-transform hover:scale-[1.02]"
        >
          開始冒險 🎲
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-border bg-card px-5 py-4">
        <p className="text-lg">
          第 <span className="font-bold">{rounds}</span> 回合
        </p>
        {laps > 1 && (
          <p className="text-lg">
            第 <span className="font-bold">{currentLap}</span> / {laps} 圈
          </p>
        )}
        <p className="text-lg">
          進度{" "}
          <span className="font-bold tabular-nums">
            {Math.min(progress, lapTarget)} / {lapTarget}
          </span>{" "}
          格
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
            onClick={startGame}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2.5 font-medium transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-5" />
            重來
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 grid-rows-5 gap-1.5 sm:gap-2">
        {board.map((cell) => {
          const here = cell.index === position;
          const color = cell.color ? COLORS[cell.color] : null;

          return (
            <div
              key={cell.index}
              style={{ gridColumn: cell.col, gridRow: cell.row }}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-xl border-2 border-black/10 text-lg",
                cell.blocked ? "bg-muted" : (color?.cell ?? "bg-muted"),
                here && "ring-4 ring-foreground",
              )}
              aria-label={
                cell.type === "start"
                  ? "起點，兔子的家"
                  : `${color?.label ?? ""}色格子${
                      cell.type === "chance" ? "，機會卡" : ""
                    }${cell.blocked ? "，有路障" : ""}`
              }
            >
              {cell.blocked ? (
                <span aria-hidden>🚧</span>
              ) : cell.type === "start" ? (
                <span aria-hidden>🏠</span>
              ) : cell.type === "chance" ? (
                <span aria-hidden>⭐</span>
              ) : (
                <span className="text-black/45" aria-hidden>
                  {color?.symbol}
                </span>
              )}

              {here && (
                <span className="absolute text-2xl sm:text-3xl" aria-hidden>
                  🐰
                </span>
              )}
            </div>
          );
        })}

        <div
          style={{ gridColumn: "2 / 7", gridRow: "2 / 5" }}
          className="flex flex-col items-center justify-center rounded-2xl bg-muted/60 p-3 text-center"
        >
          <div className="w-16 sm:w-20">
            <Rabbit happy={phase === "won"} className="w-full" />
          </div>
          <p className="mt-2 text-sm leading-snug text-muted-foreground">
            {phase === "won"
              ? "回到家了！"
              : phase === "moving"
                ? "兔子正在走…"
                : phase === "chance"
                  ? "拿到機會卡！"
                  : "排好順序再出發"}
          </p>
        </div>
      </div>

      {phase === "won" && (
        <div className="rounded-3xl border-2 border-accent bg-accent/10 p-6 text-center">
          <p className="text-2xl font-bold">
            走完 {laps} 圈，兔子回家了！🎉
          </p>
          <p
            className="mt-3 text-4xl"
            aria-label={`得到 ${rateStars(rounds, laps)} 顆星`}
          >
            <span aria-hidden>
              {"⭐".repeat(rateStars(rounds, laps))}
              <span className="opacity-25">
                {"⭐".repeat(3 - rateStars(rounds, laps))}
              </span>
            </span>
          </p>
          <p className="mt-3 text-lg text-muted-foreground">
            總共用了 {rounds} 回合
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={startGame}
              className="rounded-2xl bg-accent px-7 py-4 text-lg font-bold text-accent-foreground transition-transform hover:scale-105"
            >
              再玩一次
            </button>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="rounded-2xl border-2 border-border bg-card px-7 py-4 text-lg font-medium transition-colors hover:bg-muted"
            >
              換難度
            </button>
          </div>
        </div>
      )}

      {phase === "chance" && card && (
        <div className="rounded-3xl border-2 border-planning bg-planning/10 p-6 text-center">
          <span className="text-5xl" aria-hidden>
            {CHANCE_CARDS[card].emoji}
          </span>
          <p className="mt-3 text-2xl font-bold">{CHANCE_CARDS[card].title}</p>
          <p className="mt-2 text-lg text-muted-foreground">{CHANCE_CARDS[card].body}</p>
          <button
            type="button"
            onClick={confirmCard}
            className="mt-6 rounded-2xl bg-accent px-7 py-4 text-lg font-bold text-accent-foreground transition-transform hover:scale-105"
          >
            知道了
          </button>
        </div>
      )}

      {phase === "planning" && (
        <div className="rounded-3xl border-2 border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-xl font-bold">排出你的路線</h2>
            <p className="text-muted-foreground">
              已排 {plan.length} / {planSize}
            </p>
          </div>

          {allowRepeat && (
            <p className="mt-3 rounded-xl bg-planning/10 px-4 py-2.5 text-planning">
              機會卡生效：有一個顏色可以用兩次，同一顆骰子可以點兩下。
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {dice.map((color, index) => {
              const used = plan.filter((item) => item === index).length;
              const full = plan.length >= planSize || used >= maxPerDice;

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => addToPlan(index)}
                  disabled={full}
                  aria-label={`${COLORS[color].label}色骰子${
                    used > 0 ? `，已排入 ${used} 次` : ""
                  }`}
                  className={cn(
                    "relative flex size-16 items-center justify-center rounded-2xl border-2 text-2xl text-black/45 transition-transform sm:size-20",
                    COLORS[color].cell,
                    used > 0 ? "border-foreground" : "border-black/10",
                    full ? "opacity-45" : "hover:scale-105",
                  )}
                >
                  <span aria-hidden>{COLORS[color].symbol}</span>
                  {used > 0 && (
                    <span className="absolute -top-2 -right-2 rounded-full bg-foreground px-2 py-0.5 text-sm font-bold text-background">
                      {used}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <p className="font-medium">你的路線</p>
            <div className="mt-2 flex min-h-12 flex-wrap items-center gap-2">
              {plan.length === 0 ? (
                <p className="text-muted-foreground">
                  點上面的骰子，決定先走哪個顏色。
                </p>
              ) : (
                plan.map((diceIndex, order) => (
                  <span key={order} className="flex items-center gap-2">
                    {order > 0 && (
                      <span className="text-muted-foreground" aria-hidden>
                        →
                      </span>
                    )}
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-xl border-2 border-black/10 text-black/45",
                        COLORS[dice[diceIndex]].cell,
                      )}
                    >
                      <span aria-hidden>{COLORS[dice[diceIndex]].symbol}</span>
                      <span className="sr-only">
                        第 {order + 1} 步：{COLORS[dice[diceIndex]].label}色
                      </span>
                    </span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={departure}
              disabled={plan.length !== planSize}
              className="inline-flex items-center gap-2 rounded-2xl bg-accent px-7 py-4 text-lg font-bold text-accent-foreground transition-transform hover:scale-105 disabled:scale-100 disabled:opacity-40"
            >
              <Dices className="size-5" />
              出發！
            </button>
            <button
              type="button"
              onClick={() => setPlan(plan.slice(0, -1))}
              disabled={plan.length === 0}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-border px-6 py-4 text-lg font-medium transition-colors hover:bg-muted disabled:opacity-40"
            >
              <Undo2 className="size-5" />
              退一步
            </button>
            <button
              type="button"
              onClick={() => setPlan([])}
              disabled={plan.length === 0}
              className="rounded-2xl border-2 border-border px-6 py-4 text-lg font-medium transition-colors hover:bg-muted disabled:opacity-40"
            >
              清空
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
