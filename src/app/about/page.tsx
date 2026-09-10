import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "關於",
  description: "關於我的一些事。",
};

const skills = [
  { group: "語言", items: ["TypeScript", "Python", "SQL"] },
  { group: "前端", items: ["React", "Next.js", "Tailwind CSS"] },
  { group: "後端", items: ["Node.js", "PostgreSQL", "REST API"] },
  { group: "工具", items: ["Git", "Docker", "Vercel"] },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader title="關於我" description="這段之後換成你自己的介紹。" />
      <Container className="py-12">
        <div className="max-w-2xl space-y-4 leading-relaxed text-muted-foreground">
          <p>
            這裡先放一段佔位文字。你可以寫你現在在做什麼、對什麼有興趣、
            為什麼做這個網站，讓第一次來的人快速認識你。
          </p>
          <p>
            第二段可以聊聊你的背景與經歷，或是你最近在學的東西。
            寫得像在跟朋友說話會比條列式履歷更有記憶點。
          </p>
        </div>

        <h2 className="mt-14 text-xl font-bold tracking-tight">技能</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <div
              key={skill.group}
              className="rounded-xl border border-border bg-card p-5"
            >
              <h3 className="text-sm font-medium">{skill.group}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skill.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
