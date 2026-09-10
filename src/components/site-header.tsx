"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { navLinks, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [renderedPath, setRenderedPath] = useState(pathname);

  // 換頁後把手機選單收起來（渲染期間直接修正狀態，不需要 effect）
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="font-mono text-lg font-bold tracking-tight">
          {siteConfig.name}
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-colors",
                isActive(link.href)
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="開啟選單"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav className="border-t border-border bg-background md:hidden">
          <Container className="grid gap-1 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive(link.href)
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
