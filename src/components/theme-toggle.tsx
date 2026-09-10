"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  // 兩個圖示都渲染、靠 CSS 決定誰可見，這樣伺服器與客戶端的輸出一致，
  // 不需要 mounted 狀態就能避免 hydration 落差
  return (
    <button
      type="button"
      aria-label="切換深淺色模式"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </button>
  );
}
