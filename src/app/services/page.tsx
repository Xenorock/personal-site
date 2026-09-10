import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "服務項目",
  description: "發展評估、個別療育、家長與親師諮詢。",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="服務項目"
        description="從了解孩子開始，到把方法帶回日常生活裡。"
      />

      <Container className="py-12">
        <div className="space-y-5">
          {services.map((service) => (
            <article
              key={service.slug}
              className="rounded-3xl border-2 border-border bg-card p-6 sm:p-7"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-4xl" aria-hidden>
                  {service.emoji}
                </span>
                <h2 className="text-xl font-bold">{service.title}</h2>
              </div>

              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {service.summary}
              </p>

              <ul className="mt-4 space-y-2">
                {service.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex gap-2.5 leading-relaxed text-muted-foreground"
                  >
                    <span className="text-accent" aria-hidden>
                      ●
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border-2 border-dashed border-border bg-muted/40 p-7 text-center">
          <h2 className="text-2xl font-bold">想進一步聊聊？</h2>
          <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted-foreground">
            線上預約功能正在準備中，近期就會開放。
            在那之前，歡迎先帶孩子玩玩遊戲，或到家長園地看看。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/games"
              className="rounded-2xl bg-accent px-7 py-4 font-bold text-accent-foreground transition-transform hover:scale-105"
            >
              去遊戲區
            </Link>
            <Link
              href="/articles"
              className="rounded-2xl border-2 border-border bg-card px-7 py-4 font-medium transition-colors hover:bg-muted"
            >
              家長園地
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
