import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "服務項目",
  description: "兒童發展評估、個別療育課程、家長諮詢與校園入班觀察。",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="服務項目"
        description="從評估到療育，再到把方法帶回家，陪你和孩子一起走。"
      />

      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.slug}
              className="rounded-3xl border-2 border-border bg-card p-6"
            >
              <span className="text-4xl" aria-hidden>
                {service.emoji}
              </span>
              <h2 className="mt-4 text-xl font-bold">{service.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
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

        <div className="mt-12 rounded-3xl border-2 border-border bg-muted/40 p-7 text-center">
          <h2 className="text-2xl font-bold">不確定孩子適合哪一種？</h2>
          <p className="mx-auto mt-3 max-w-lg leading-relaxed text-muted-foreground">
            先聊聊吧。把孩子的狀況與你的疑問告訴我，我會給你初步的建議與方向。
          </p>
          <Link
            href="/booking"
            className="mt-6 inline-block rounded-2xl bg-accent px-7 py-4 font-bold text-accent-foreground transition-transform hover:scale-105"
          >
            預約諮詢
          </Link>
        </div>
      </Container>
    </>
  );
}
