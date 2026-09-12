"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Rabbit } from "@/components/rabbit";
import {
  addObstacle,
  availableMoves,
  BASE_DICE,
  cellCenter,
  cellPath,
  clearObstaclesAt,
  COLORS,
  createBoard,
  LANE_GEOMETRY,
  pickRandom,
  rollPlayableDice,
  TRACK_WIDTH,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  withRepeatBonus,
  type Cell,
  type ColorKey,
  type Move,
  type Position,
} from "@/lib/color-quest";
import { playFlip, playMatch, playWin, playWrong } from "@/lib/sound";
import { cn } from "@/lib/utils";

type ChanceKind = "extraDice" | "repeatColor" | "obstacle";
type Phase = "idle" | "playing" | "chance" | "won";

const CHANCE_CARDS: Record<
  ChanceKind,
  { title: string; body: string; emoji: string }
> = {
  extraDice: {
    title: "多一顆骰子！",
    body: "下一回合可以丟六顆骰子。",
    emoji: "🎲",
  },
  repeatColor: {
    title: "有顏色可以用兩次！",
    body: "下一回合會有一顆骰子能用兩次。",
    emoji: "🔁",
  },
  obstacle: {
    title: "前面出現路障！",
    body: "前方多了一個路障，那一格不能走。繞到別條軌道過去，它就會消失。",
    emoji: "🚧",
  },
};

const CHANCE_KINDS = Object.keys(CHANCE_CARDS) as ChanceKind[];

const LEVELS = [
  { label: "散步", cells: 10, hint: "走半圈" },
  { label: "遠足", cells: 20, hint: "繞一圈" },
  { label: "大冒險", cells: 40, hint: "繞兩圈" },
] as const;

const START: Position = { lane: 1, pos: 0 };

/** 沿著格子形狀畫一圈外框：先描一條較粗的線，再用原色蓋回中間 */
function CellOutline({
  board,
  cell,
  color,
}: {
  board: Cell[][];
  cell: Position;
  color: string;
}) {
  const geo = LANE_GEOMETRY[cell.lane];
  const target = board[cell.lane][cell.pos];

  return (
    <g pointerEvents="none">
      {/* 外框往四周各多 6 個單位，頭尾也要延伸才不會缺角 */}
      <path
        d={cellPath(geo, cell.pos, 6)}
        stroke={color}
        strokeWidth={TRACK_WIDTH + 12}
        fill="none"
      />
      <path
        d={cellPath(geo, cell.pos)}
        stroke={target.blocked ? "#c9c3ba" : COLORS[target.color].hex}
        strokeWidth={TRACK_WIDTH}
        fill="none"
      />
    </g>
  );
}

// 一回合最多五步，實測平均三步出頭，所以三顆星要走得比平均更有效率
function rateStars(rounds: number, target: number) {
  if (rounds <= Math.ceil(target / 4)) return 3;
  if (rounds <= Math.ceil(target / 3)) return 2;
  return 1;
}

// 中央鏤空區換算成百分比，讓資訊區跟著 SVG 一起縮放
const CENTER_BOX = {
  left: `${((LANE_GEOMETRY[2].x + TRACK_WIDTH) / VIEW_WIDTH) * 100}%`,
  top: `${((LANE_GEOMETRY[2].y + TRACK_WIDTH) / VIEW_HEIGHT) * 100}%`,
  width: `${((LANE_GEOMETRY[2].w - TRACK_WIDTH * 2) / VIEW_WIDTH) * 100}%`,
  height: `${((LANE_GEOMETRY[2].h - TRACK_WIDTH * 2) / VIEW_HEIGHT) * 100}%`,
};

export function ColorQuest() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [at, setAt] = useState<Position>(START);
  const [progress, setProgress] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [dice, setDice] = useState<ColorKey[]>([]);
  const [remaining, setRemaining] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [card, setCard] = useState<ChanceKind | null>(null);
  const [soundOn, setSoundOn] = useState(true);
  const [levelIndex, setLevelIndex] = useState(1);
  const [wrong, setWrong] = useState<Position | null>(null);
  const [focusCell, setFocusCell] = useState<Position | null>(null);

  // 機會卡的效果都是下一回合才生效
  const [nextBonus, setNextBonus] = useState(0);
  const [nextRepeat, setNextRepeat] = useState(false);

  const target = LEVELS[levelIndex].cells;
  const moves =
    phase === "playing" && board.length > 0
      ? availableMoves(board, at, dice, remaining)
      : [];
  const diceLeft = remaining.reduce((sum, count) => sum + count, 0);
  const stuck = phase === "playing" && moves.length === 0 && diceLeft > 0;

  function playIfOn(play: () => void) {
    if (soundOn) play();
  }

  // 走錯的紅框閃一下就收掉。每次點擊都給新物件，連點同一格也會重新計時
  useEffect(() => {
    if (!wrong) return;
    const timer = setTimeout(() => setWrong(null), 700);
    return () => clearTimeout(timer);
  }, [wrong]);

  function beginRound(
    from: Position,
    bonus: number,
    repeat: boolean,
    useBoard: Cell[][],
  ) {
    const nextDice = rollPlayableDice(useBoard, from, BASE_DICE + bonus);
    const base = nextDice.map(() => 1);

    setDice(nextDice);
    setRemaining(repeat ? withRepeatBonus(base) : base);
    setRounds((value) => value + 1);
    setNextBonus(0);
    setNextRepeat(false);
    setPhase("playing");
  }

  // 棋盤與骰子都在使用者按下開始後才產生，避免伺服器與客戶端結果不一致
  function startGame() {
    const nextBoard = createBoard();
    const nextDice = rollPlayableDice(nextBoard, START, BASE_DICE);

    setBoard(nextBoard);
    setAt(START);
    setProgress(0);
    setRounds(1);
    setDice(nextDice);
    setRemaining(nextDice.map(() => 1));
    setCard(null);
    setNextBonus(0);
    setNextRepeat(false);
    setWrong(null);
    setPhase("playing");
  }

  function handleMove(move: Move) {
    const nextRemaining = [...remaining];
    nextRemaining[move.diceIndex] -= 1;
    const nextAt: Position = { lane: move.lane, pos: move.pos };
    const nextProgress = progress + 1;
    // 走過這一排就代表繞過去了，那一排的路障可以清掉
    const nextBoard = clearObstaclesAt(board, move.pos);

    setRemaining(nextRemaining);
    setAt(nextAt);
    setProgress(nextProgress);
    if (nextBoard !== board) setBoard(nextBoard);
    playIfOn(playFlip);

    if (nextProgress >= target) {
      setPhase("won");
      playIfOn(playWin);
      return;
    }

    if (board[move.lane][move.pos].type === "chance") {
      setCard(pickRandom(CHANCE_KINDS));
      setPhase("chance");
      playIfOn(playMatch);
      return;
    }

    if (nextRemaining.every((count) => count === 0)) {
      beginRound(nextAt, nextBonus, nextRepeat, nextBoard);
    }
  }

  function handleCellClick(lane: number, pos: number) {
    if (phase !== "playing") return;

    const move = moves.find((item) => item.lane === lane && item.pos === pos);
    if (move) {
      setWrong(null);
      handleMove(move);
      return;
    }

    playIfOn(playWrong);
    setWrong({ lane, pos });
  }

  function confirmCard() {
    if (!card) return;

    let bonus = nextBonus;
    let repeat = nextRepeat;
    let nextBoard = board;

    if (card === "extraDice") bonus = 1;
    if (card === "repeatColor") repeat = true;
    if (card === "obstacle") {
      nextBoard = addObstacle(board, at);
      setBoard(nextBoard);
    }

    setCard(null);

    // 這回合骰子還沒用完就先收著，等回合結束再套用
    if (remaining.some((count) => count > 0)) {
      setNextBonus(bonus);
      setNextRepeat(repeat);
      setPhase("playing");
      return;
    }

    beginRound(at, bonus, repeat, nextBoard);
  }

  if (phase === "idle") {
    return (
      <div className="rounded-3xl border-2 border-border bg-card p-6 sm:p-8">
        <h2 className="text-xl font-bold">怎麼玩</h2>
        <ol className="mt-4 space-y-3 text-lg leading-relaxed text-muted-foreground">
          <li>
            <span className="font-bold text-foreground">1.</span>{" "}
            每回合丟五顆彩色骰子，一顆骰子可以走一格。
          </li>
          <li>
            <span className="font-bold text-foreground">2.</span> 只能走到
            <strong className="text-foreground">顏色一樣的下一格</strong>
            。跑道有三圈，前面那一排的三格都可以選，看哪一格跟你的骰子同色。
          </li>
          <li>
            <span className="font-bold text-foreground">3.</span>{" "}
            如果前面三格都沒有你手上的顏色，就走不動了，只好換下一回合。
          </li>
          <li>
            <span className="font-bold text-foreground">4.</span> 踩到 ⭐ 會拿到機會卡，
            走完指定格數就過關。
          </li>
        </ol>

        <p className="mt-5 rounded-xl bg-planning/10 px-4 py-3 text-planning">
          畫面不會標出哪一格能走，要自己找。點錯了會有聲音提醒，再看看就好。
          先想清楚顏色的使用順序，才不會走到一半卡住；用越少回合走完，星星越多。
        </p>

        <fieldset className="mt-6">
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
                  {item.hint}（{item.cells} 格）
                </span>
              </button>
            ))}
          </div>
        </fieldset>

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

  const rabbitAt = cellCenter(LANE_GEOMETRY[at.lane], at.pos);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-border bg-card px-5 py-4">
        <p className="text-lg">
          第 <span className="font-bold">{rounds}</span> 回合
        </p>
        <p className="text-lg">
          還有{" "}
          <span className="font-bold tabular-nums">
            {Math.max(target - progress, 0)}
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
            onClick={() => setPhase("idle")}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-border px-4 py-2.5 font-medium transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-5" />
            重來
          </button>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
          className="w-full"
          role="img"
          aria-label={`彩色跑道，兔子在第 ${at.lane + 1} 圈第 ${at.pos + 1} 格`}
        >
          {board.map((lane, laneIndex) =>
            lane.map((cell) => (
              <path
                key={`cell-${laneIndex}-${cell.pos}`}
                d={cellPath(LANE_GEOMETRY[laneIndex], cell.pos)}
                stroke={cell.blocked ? "#c9c3ba" : COLORS[cell.color].hex}
                strokeWidth={TRACK_WIDTH}
                fill="none"
              />
            )),
          )}

          {focusCell && phase === "playing" && (
            <CellOutline board={board} cell={focusCell} color="#4a3728" />
          )}

          {wrong && <CellOutline board={board} cell={wrong} color="#dc2626" />}

          {board.map((lane, laneIndex) =>
            lane.map((cell) => {
              const point = cellCenter(LANE_GEOMETRY[laneIndex], cell.pos);
              const mark = cell.blocked
                ? "🚧"
                : cell.pos === 0
                  ? "🏠"
                  : cell.type === "chance"
                    ? "⭐"
                    : null;

              return (
                <text
                  key={`mark-${laneIndex}-${cell.pos}`}
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={mark ? 24 : 19}
                  fill={mark ? undefined : "rgba(0,0,0,0.38)"}
                  pointerEvents="none"
                >
                  {mark ?? COLORS[cell.color].symbol}
                </text>
              );
            }),
          )}

          <g
            style={{
              transform: `translate(${rabbitAt.x}px, ${rabbitAt.y}px)`,
              transition: "transform 0.35s ease",
            }}
            pointerEvents="none"
          >
            <circle r={23} fill="#fdfbf7" stroke="#4a3728" strokeWidth={3} />
            <text textAnchor="middle" dominantBaseline="central" fontSize={26}>
              🐰
            </text>
          </g>

          {/* 不標出哪幾格能走，讓孩子自己找；點錯了會有提示音與紅框 */}
          {board.map((lane, laneIndex) =>
            lane.map((cell) => {
              const label = `第 ${laneIndex + 1} 圈第 ${cell.pos + 1} 格，${
                COLORS[cell.color].label
              }色${cell.blocked ? "，有路障" : ""}`;

              return (
                <path
                  key={`hit-${laneIndex}-${cell.pos}`}
                  d={cellPath(LANE_GEOMETRY[laneIndex], cell.pos)}
                  className="track-cell"
                  stroke="transparent"
                  strokeWidth={TRACK_WIDTH}
                  fill="none"
                  pointerEvents="stroke"
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  style={{ cursor: phase === "playing" ? "pointer" : "default" }}
                  onFocus={(event) => {
                    // 只有鍵盤操作才顯示外框，滑鼠點選不需要
                    if (event.currentTarget.matches(":focus-visible")) {
                      setFocusCell({ lane: laneIndex, pos: cell.pos });
                    }
                  }}
                  onBlur={() => setFocusCell(null)}
                  onClick={(event) => {
                    // detail 大於 0 代表滑鼠或觸控，鍵盤合成的點擊不該失去焦點
                    if (event.detail > 0) event.currentTarget.blur();
                    handleCellClick(laneIndex, cell.pos);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCellClick(laneIndex, cell.pos);
                    }
                  }}
                >
                  <title>{label}</title>
                </path>
              );
            }),
          )}
        </svg>

        <div
          className="pointer-events-none absolute flex flex-col items-center justify-center text-center"
          style={CENTER_BOX}
        >
          <div className="w-14 sm:w-20">
            <Rabbit happy={phase === "won"} className="w-full" />
          </div>
          <p className="mt-2 text-sm leading-snug text-muted-foreground sm:text-base">
            {phase === "won"
              ? "到家了！"
              : phase === "chance"
                ? "拿到機會卡！"
                : stuck
                  ? "走不動了…"
                  : "找找看哪一格可以走"}
          </p>
        </div>
      </div>

      {phase === "won" && (
        <div className="rounded-3xl border-2 border-accent bg-accent/10 p-6 text-center">
          <p className="text-2xl font-bold">走完 {target} 格，兔子到家了！🎉</p>
          <p
            className="mt-3 text-4xl"
            aria-label={`得到 ${rateStars(rounds, target)} 顆星`}
          >
            <span aria-hidden>
              {"⭐".repeat(rateStars(rounds, target))}
              <span className="opacity-25">
                {"⭐".repeat(3 - rateStars(rounds, target))}
              </span>
            </span>
          </p>
          <p className="mt-3 text-lg text-muted-foreground">總共用了 {rounds} 回合</p>
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

      {(phase === "playing" || phase === "chance") && (
        <div className="rounded-3xl border-2 border-border bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-xl font-bold">這回合的骰子</h2>
            <p className="text-muted-foreground">還剩 {diceLeft} 顆沒用</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {dice.map((color, index) => (
              <div
                key={index}
                aria-label={`${COLORS[color].label}色骰子${
                  remaining[index] === 0
                    ? "，已用掉"
                    : remaining[index] > 1
                      ? "，可以用兩次"
                      : ""
                }`}
                className={cn(
                  "relative flex size-14 items-center justify-center rounded-2xl border-2 border-black/10 text-2xl text-black/45 sm:size-16",
                  remaining[index] === 0 && "opacity-25",
                )}
                style={{ backgroundColor: COLORS[color].hex }}
              >
                <span aria-hidden>{COLORS[color].symbol}</span>
                {remaining[index] > 1 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-foreground px-2 py-0.5 text-sm font-bold text-background">
                    ×2
                  </span>
                )}
              </div>
            ))}
          </div>

          {stuck ? (
            <div className="mt-5">
              <p className="text-lg">
                前面三格都沒有剩下的顏色，這回合走不動了。
              </p>
              <button
                type="button"
                onClick={() => beginRound(at, nextBonus, nextRepeat, board)}
                className="mt-4 rounded-2xl bg-accent px-7 py-4 text-lg font-bold text-accent-foreground transition-transform hover:scale-105"
              >
                換下一回合
              </button>
            </div>
          ) : (
            <p className="mt-4 text-muted-foreground">
              看看兔子前面那一排，哪一格的顏色跟骰子一樣就點它。
            </p>
          )}
        </div>
      )}
    </div>
  );
}
