// 用 Web Audio API 直接合成音效，不需要載入任何音檔。
// 音量刻意壓低，避免孩子被突然的聲音嚇到。

type AudioContextCtor = typeof AudioContext;

let context: AudioContext | null = null;

function getContext() {
  if (typeof window === "undefined") return null;

  if (!context) {
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor })
        .webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }

  // 瀏覽器政策：必須由使用者互動觸發才能播放
  if (context.state === "suspended") {
    void context.resume();
  }

  return context;
}

function tone(frequency: number, delay: number, duration: number, volume = 0.12) {
  const ctx = getContext();
  if (!ctx) return;

  const start = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  // 用漸入漸出的包絡避免爆音
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playFlip() {
  tone(520, 0, 0.1);
}

export function playMatch() {
  tone(660, 0, 0.14);
  tone(880, 0.1, 0.2);
}

// 走錯格子的提示。刻意用柔和的下降音，不帶懲罰感
export function playWrong() {
  tone(330, 0, 0.12, 0.09);
  tone(247, 0.09, 0.2, 0.09);
}

export function playWin() {
  tone(660, 0, 0.16);
  tone(880, 0.14, 0.16);
  tone(1050, 0.28, 0.34);
}
