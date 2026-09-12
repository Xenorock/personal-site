// 顏色大冒險的規則運算，與畫面無關，方便單獨驗證正確性。

export type ColorKey = "red" | "blue" | "yellow" | "green" | "purple";
export type CellType = "start" | "normal" | "chance";

export type Cell = {
  index: number;
  col: number;
  row: number;
  color: ColorKey | null;
  type: CellType;
  blocked: boolean;
};

export type Step = {
  color: ColorKey;
  /** 找不到可走的同色格時為 null，該步原地不動 */
  target: number | null;
  distance: number;
};

export type ChanceKind = "extraDice" | "repeatColor" | "obstacle";

// 除了顏色，每格再加一個形狀符號，讓色覺辨識有困難的孩子也能玩
export const COLORS: Record<
  ColorKey,
  { label: string; symbol: string; cell: string }
> = {
  red: { label: "紅", symbol: "♥", cell: "bg-red-400" },
  blue: { label: "藍", symbol: "★", cell: "bg-sky-400" },
  yellow: { label: "黃", symbol: "●", cell: "bg-amber-300" },
  green: { label: "綠", symbol: "▲", cell: "bg-emerald-400" },
  purple: { label: "紫", symbol: "◆", cell: "bg-violet-400" },
};

export const COLOR_KEYS = Object.keys(COLORS) as ColorKey[];

export const BOARD_COLS = 7;
export const BOARD_ROWS = 5;
export const BASE_DICE = 5;
export const CHANCE_CELLS = 4;
export const MIN_PER_COLOR = 3;

// 沿著長方形外圈依順時針排出格子座標
export function createLayout(cols: number, rows: number) {
  const cells: { col: number; row: number }[] = [];
  for (let col = 1; col <= cols; col += 1) cells.push({ col, row: 1 });
  for (let row = 2; row <= rows; row += 1) cells.push({ col: cols, row });
  for (let col = cols - 1; col >= 1; col -= 1) cells.push({ col, row: rows });
  for (let row = rows - 1; row >= 2; row -= 1) cells.push({ col: 1, row });
  return cells;
}

export function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createBoard(): Cell[] {
  const layout = createLayout(BOARD_COLS, BOARD_ROWS);
  const colorSlots = layout.length - 1;

  // 先保證每個顏色都有足夠格數，剩下的再隨機補滿
  const colors: ColorKey[] = [];
  COLOR_KEYS.forEach((key) => {
    for (let i = 0; i < MIN_PER_COLOR; i += 1) colors.push(key);
  });
  while (colors.length < colorSlots) {
    colors.push(COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)]);
  }
  const shuffled = shuffle(colors);

  const chanceIndices = new Set<number>();
  while (chanceIndices.size < CHANCE_CELLS) {
    chanceIndices.add(1 + Math.floor(Math.random() * colorSlots));
  }

  return layout.map((position, index) => ({
    index,
    col: position.col,
    row: position.row,
    color: index === 0 ? null : shuffled[index - 1],
    type: index === 0 ? "start" : chanceIndices.has(index) ? "chance" : "normal",
    blocked: false,
  }));
}

export function rollDice(count: number): ColorKey[] {
  return Array.from(
    { length: count },
    () => COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)],
  );
}

// 從 from 往前找第一個同色且沒被路障擋住的格子，找不到就回 null
export function findNext(board: Cell[], from: number, color: ColorKey) {
  for (let distance = 1; distance <= board.length; distance += 1) {
    const index = (from + distance) % board.length;
    const cell = board[index];
    if (cell.blocked) continue;
    if (cell.color === color) return { index, distance };
  }
  return null;
}

export function resolvePlan(
  board: Cell[],
  from: number,
  plan: number[],
  dice: ColorKey[],
): Step[] {
  const steps: Step[] = [];
  let cursor = from;

  plan.forEach((diceIndex) => {
    const color = dice[diceIndex];
    const next = findNext(board, cursor, color);
    if (!next) {
      steps.push({ color, target: null, distance: 0 });
      return;
    }
    steps.push({ color, target: next.index, distance: next.distance });
    cursor = next.index;
  });

  return steps;
}

export function addObstacle(board: Cell[], from: number): Cell[] {
  const candidates: number[] = [];
  for (let distance = 2; distance <= 8; distance += 1) {
    const index = (from + distance) % board.length;
    if (index !== 0 && !board[index].blocked) candidates.push(index);
  }
  if (candidates.length === 0) return board;

  const target = candidates[Math.floor(Math.random() * candidates.length)];
  return board.map((cell) =>
    cell.index === target ? { ...cell, blocked: true } : cell,
  );
}
