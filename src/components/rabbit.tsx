type RabbitProps = {
  className?: string;
  /** 瞳孔偏移量（-1 ~ 1），用來讓兔子的視線跟著游標 */
  lookX?: number;
  lookY?: number;
  /** 開心時嘴巴會變成笑臉 */
  happy?: boolean;
};

const PUPIL_RANGE = 3.5;

export function Rabbit({
  className,
  lookX = 0,
  lookY = 0,
  happy = false,
}: RabbitProps) {
  const dx = Math.max(-1, Math.min(1, lookX)) * PUPIL_RANGE;
  const dy = Math.max(-1, Math.min(1, lookY)) * PUPIL_RANGE;

  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label="tutu 老師的兔子夥伴"
    >
      {/* 耳朵 */}
      <g>
        <ellipse cx="43" cy="34" rx="10" ry="28" fill="#fdfbf7" stroke="#e6dccd" strokeWidth="2.5" />
        <ellipse cx="43" cy="36" rx="4.5" ry="20" fill="#f9c9d8" />
        <ellipse cx="77" cy="34" rx="10" ry="28" fill="#fdfbf7" stroke="#e6dccd" strokeWidth="2.5" />
        <ellipse cx="77" cy="36" rx="4.5" ry="20" fill="#f9c9d8" />
      </g>

      {/* 臉 */}
      <circle cx="60" cy="76" r="32" fill="#fdfbf7" stroke="#e6dccd" strokeWidth="2.5" />

      {/* 腮紅 */}
      <ellipse cx="38" cy="82" rx="7" ry="4.5" fill="#f9c9d8" opacity="0.85" />
      <ellipse cx="82" cy="82" rx="7" ry="4.5" fill="#f9c9d8" opacity="0.85" />

      {/* 眼睛：瞳孔會依 lookX / lookY 移動 */}
      <circle cx="49" cy="71" r="6" fill="#fff" stroke="#e6dccd" strokeWidth="1.5" />
      <circle cx={49 + dx} cy={71 + dy} r="3.6" fill="#4a3728" />
      <circle cx="71" cy="71" r="6" fill="#fff" stroke="#e6dccd" strokeWidth="1.5" />
      <circle cx={71 + dx} cy={71 + dy} r="3.6" fill="#4a3728" />

      {/* 鼻子與嘴 */}
      <path d="M56.5 82 h7 l-3.5 4 Z" fill="#f2879f" />
      {happy ? (
        <path
          d="M52 88 q8 8 16 0"
          fill="none"
          stroke="#4a3728"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M60 86 v3 M60 89 q-4 4 -7 1 M60 89 q4 4 7 1"
          fill="none"
          stroke="#4a3728"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function Carrot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path d="M24 44 L14 20 q10 -6 20 0 Z" fill="#f28c28" />
      <path d="M19 27 l4 2 M23 34 l4 2" stroke="#d9741c" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M24 20 q-2 -9 -9 -11 q3 8 9 11 Z M24 20 q2 -9 9 -11 q-3 8 -9 11 Z M24 19 q0 -10 0 -13 q3 7 0 13 Z"
        fill="#5aa469"
      />
    </svg>
  );
}
