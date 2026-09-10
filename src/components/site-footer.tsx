import Link from "next/link";
import { Mail } from "lucide-react";
import { Container } from "@/components/container";
import { GithubIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border py-10">
      <Container className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <div className="flex items-center gap-4">
          <a
            href={siteConfig.author.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="transition-colors hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
          <Link
            href="/contact"
            aria-label="聯絡我"
            className="transition-colors hover:text-foreground"
          >
            <Mail className="size-4" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
