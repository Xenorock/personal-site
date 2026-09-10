import type { Metadata } from "next";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "家長園地",
  description: "兒童發展、感覺統合與居家活動的實用資訊。",
};

const plannedTopics = [
  "孩子寫字很醜，是手部肌肉的問題嗎？",
  "什麼是感覺統合？家長常見的三個誤解",
  "在家就能做的十個手眼協調小遊戲",
  "孩子坐不住，是過動還是還沒學會控制？",
];

export default function ArticlesPage() {
  return (
    <>
      <PageHeader
        title="家長園地"
        description="把治療室裡常被問到的問題，寫成你在家就用得上的文章。"
      />

      <Container className="py-12">
        <EmptyState
          title="文章準備中"
          description="第一批文章正在整理。這個區塊會用 MDX 撰寫，方便日後持續新增。"
        />

        <section className="mt-12">
          <h2 className="text-xl font-bold">預計要寫的主題</h2>
          <ul className="mt-5 space-y-3">
            {plannedTopics.map((topic) => (
              <li
                key={topic}
                className="rounded-2xl bg-muted/60 px-5 py-4 leading-relaxed text-muted-foreground"
              >
                {topic}
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
