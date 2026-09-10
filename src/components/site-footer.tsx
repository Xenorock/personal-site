import Link from "next/link";
import { Container } from "@/components/container";
import { Rabbit } from "@/components/rabbit";
import { navLinks, siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-border bg-muted/40 py-12">
      <Container className="space-y-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Rabbit className="size-10" />
              <span className="text-lg font-bold">{siteConfig.name}</span>
            </div>
            <p className="mt-3 max-w-xs leading-relaxed text-muted-foreground">
              {siteConfig.author.role}．{siteConfig.tagline}
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="border-t border-border pt-6 text-sm leading-relaxed text-muted-foreground">
          本站的遊戲與文章僅供親子互動與練習參考，不能取代專業評估與治療。
          若對孩子的發展有疑慮，請諮詢職能治療師或相關專業人員。
          <br />© {new Date().getFullYear()} {siteConfig.name}
        </p>
      </Container>
    </footer>
  );
}
