// 顏色大冒險的規則與軌道幾何，與畫面無關，方便單獨驗證正確性。
//
// 棋盤是三圈同心的圓角跑道。一顆骰子只能走一格，而且那一格的顏色必須跟骰子一樣。
// 每一步可以往正前方，也可以切到內外相鄰的軌道，但顏色一樣要對得上。

export type ColorKey = "red" | "blue" | "orange" | "purple" | "green" | "yellow";
export type CellType = "normal" | "chance";

export type Cell = {
  lane: number;
  pos: number;
  color: ColorKey;
  type: CellType;
  blocked: boolean;
};

export type Position = { lane: number; pos: number };
export type Move = Position & { diceIndex: number };

// 除了顏色，每格再加一個形狀符號，讓色覺辨識有困難的孩子也能玩
export const COLORS: Record<ColorKey, { label: string; symbol: string; hex: string }> = {
  red: { label: "紅", symbol: "♥", hex: "#ee3b34" },
  blue: { label: "藍", symbol: "★", hex: "#3cb0f0" },
  orange: { label: "橘", symbol: "●", hex: "#f89a44" },
  purple: { label: "紫", symbol: "▲", hex: "#8f52e8" },
  green: { label: "綠", symbol: "■", hex: "#16a34a" },
  yellow: { label: "黃", symbol: "◆", hex: "#fbd75b" },
};

export const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];

export const LANES = 3;
export const CELLS_PER_LANE = 20;
export const BASE_DICE = 5;
export const CHANCE_PER_LANE = 2;

// 跑道分成八段：上、右上彎、右、右下彎、下、左下彎、左、左上彎。
// 三圈用同一組分配，格子才會放射狀對齊，孩子看得出哪幾格是相切的。
const SEGMENT_CELLS = [4, 2, 2, 2, 4, 2, 2, 2];

export type Geometry = { x: number; y: number; w: number; h: number; r: number };

export const VIEW_WIDTH = 1000;
export const VIEW_HEIGHT = 700;
export const TRACK_WIDTH = 52;

// 由外而內三圈，間距與圓角同步縮小，讓三圈的直線段長度一致
export const LANE_GEOMETRY: Geometry[] = [
  { x: 52, y: 52, w: 896, h: 596, r: 180 },
  { x: 110, y: 110, w: 780, h: 480, r: 122 },
  { x: 168, y: 168, w: 664, h: 364, r: 64 },
];

function cellRange(index: number) {
  let remaining = index;
  for (let seg = 0; seg < SEGMENT_CELLS.length; seg += 1) {
    const count = SEGMENT_CELLS[seg];
    if (remaining >= count) {
      remaining -= count;
      continue;
    }
    return { seg, u0: remaining / count, u1: (remaining + 1) / count };
  }
  return { seg: 0, u0: 0, u1: 1 };
}

function pointOnSegment(g: Geometry, seg: number, u: number) {
  const { x, y, w, h, r } = g;
  const straightX = w - 2 * r;
  const straightY = h - 2 * r;
  const quarter = Math.PI / 2;

  switch (seg) {
    case 0:
      return { x: x + r + u * straightX, y };
    case 1: {
      const angle = -quarter + u * quarter;
      return {
        x: x + w - r + r * Math.cos(angle),
        y: y + r + r * Math.sin(angle),
      };
    }
    case 2:
      return { x: x + w, y: y + r + u * straightY };
    case 3: {
      const angle = u * quarter;
      return {
        x: x + w - r + r * Math.cos(angle),
        y: y + h - r + r * Math.sin(angle),
      };
    }
    case 4:
      return { x: x + w - r - u * straightX, y: y + h };
    case 5: {
      const angle = quarter + u * quarter;
      return {
        x: x + r + r * Math.cos(angle),
        y: y + h - r + r * Math.sin(angle),
      };
    }
    case 6:
      return { x, y: y + h - r - u * straightY };
    default: {
      const angle = Math.PI + u * quarter;
      return {
        x: x + r + r * Math.cos(angle),
        y: y + r + r * Math.sin(angle),
      };
    }
  }
}

/** 單一格子的軌道形狀，直線段畫線、轉彎段畫弧 */
export function cellPath(g: Geometry, index: number) {
  const { seg, u0, u1 } = cellRange(index);
  const pad = (u1 - u0) * 0.06; // 讓相鄰磚塊之間留一點縫
  const start = pointOnSegment(g, seg, u0 + pad);
  const end = pointOnSegment(g, seg, u1 - pad);

  if (seg % 2 === 0) {
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} L ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${g.r} ${g.r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
}

export function cellCenter(g: Geometry, index: number) {
  const { seg, u0, u1 } = cellRange(index);
  return pointOnSegment(g, seg, (u0 + u1) / 2);
}

export function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomColor() {
  return pickRandom(COLOR_KEYS);
}

/** 機會卡「顏色可以用兩次」：隨機挑一顆骰子讓它多一次使用機會 */
export function withRepeatBonus(remaining: number[]): number[] {
  if (remaining.length === 0) return remaining;
  const lucky = Math.floor(Math.random() * remaining.length);
  return remaining.map((count, index) => (index === lucky ? count + 1 : count));
}

export function createBoard(): Cell[][] {
  // 同一排的三格一定給三種不同顏色。三格同色的話等於沒得選，
  // 孩子會常常一步都走不動。
  const paletteByPos = Array.from({ length: CELLS_PER_LANE }, () =>
    shuffle(COLOR_KEYS).slice(0, LANES),
  );

  return Array.from({ length: LANES }, (_, lane) => {
    const chance = new Set<number>();
    while (chance.size < CHANCE_PER_LANE) {
      // 起點那一格不放機會卡
      chance.add(1 + Math.floor(Math.random() * (CELLS_PER_LANE - 1)));
    }

    return Array.from({ length: CELLS_PER_LANE }, (_, pos) => ({
      lane,
      pos,
      color: paletteByPos[pos][lane],
      type: chance.has(pos) ? ("chance" as const) : ("normal" as const),
      blocked: false,
    }));
  });
}

export function rollDice(count: number): ColorKey[] {
  return Array.from({ length: count }, randomColor);
}

/** 下一步能踩到的三格：正前方，以及內外相鄰軌道的斜前方 */
export function candidates(board: Cell[][], from: Position): Position[] {
  const pos = (from.pos + 1) % CELLS_PER_LANE;

  return [from.lane - 1, from.lane, from.lane + 1]
    .filter((lane) => lane >= 0 && lane < LANES)
    .filter((lane) => !board[lane][pos].blocked)
    .map((lane) => ({ lane, pos }));
}

/**
 * 候選格裡顏色對得上、而且骰子還有剩餘次數的走法。
 * remaining 用次數而不是布林值，機會卡「顏色可以用兩次」才好表示。
 */
export function availableMoves(
  board: Cell[][],
  from: Position,
  dice: ColorKey[],
  remaining: number[],
): Move[] {
  const moves: Move[] = [];

  candidates(board, from).forEach((cell) => {
    const color = board[cell.lane][cell.pos].color;
    const diceIndex = dice.findIndex(
      (die, index) => remaining[index] > 0 && die === color,
    );
    if (diceIndex >= 0) moves.push({ ...cell, diceIndex });
  });

  return moves;
}

/**
 * 開局就一步都走不動只是運氣差，不是孩子的決策失誤，
 * 所以重丟到至少能走一步為止。中途因為順序排錯而卡住仍然算數。
 */
export function rollPlayableDice(
  board: Cell[][],
  from: Position,
  count: number,
): ColorKey[] {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const dice = rollDice(count);
    const remaining = dice.map(() => 1);
    if (availableMoves(board, from, dice, remaining).length > 0) return dice;
  }
  return rollDice(count);
}

/** 在前方隨機一格放路障，避開起點與兔子腳下那格 */
export function addObstacle(board: Cell[][], from: Position): Cell[][] {
  const spots: Position[] = [];

  for (let ahead = 2; ahead <= 6; ahead += 1) {
    const pos = (from.pos + ahead) % CELLS_PER_LANE;
    if (pos === 0) continue;

    // 同一格位置至少要留一條軌道可以通過，不然兔子會被整排擋死
    const blocked = board.filter((lane) => lane[pos].blocked).length;
    if (blocked >= LANES - 1) continue;

    for (let lane = 0; lane < LANES; lane += 1) {
      if (!board[lane][pos].blocked) spots.push({ lane, pos });
    }
  }

  if (spots.length === 0) return board;

  const target = spots[Math.floor(Math.random() * spots.length)];
  return board.map((lane, laneIndex) =>
    laneIndex === target.lane
      ? lane.map((cell) => (cell.pos === target.pos ? { ...cell, blocked: true } : cell))
      : lane,
  );
}

/**
 * 兔子走過某一排之後，那一排的路障就算被繞過去了，直接清掉。
 * 這樣難度不會一路累積，孩子也會有「我解決掉它了」的感覺。
 */
export function clearObstaclesAt(board: Cell[][], pos: number): Cell[][] {
  if (!board.some((lane) => lane[pos].blocked)) return board;

  return board.map((lane) =>
    lane.map((cell) =>
      cell.pos === pos && cell.blocked ? { ...cell, blocked: false } : cell,
    ),
  );
}

/** 同一個 pos 的三格不能同時被擋住，否則兔子會完全過不去 */
export function isPassable(board: Cell[][], pos: number) {
  return board.some((lane) => !lane[pos].blocked);
}
