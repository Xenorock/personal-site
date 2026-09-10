import type { Metadata } from "next";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "文章",
  description: "技術筆記與開發心得。",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader title="文章" description="技術筆記、踩坑紀錄，還有一些隨手寫的東西。" />
      <Container className="py-12">
        <EmptyState
          title="還沒有文章"
          description="部落格會用 MDX 撰寫，文章跟程式碼一起進版控。這部分排在階段 3 實作。"
        />
      </Container>
    </>
  );
}
