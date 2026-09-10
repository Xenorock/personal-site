import type { Metadata } from "next";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "留言板",
  description: "留個腳印吧。",
};

export default function GuestbookPage() {
  return (
    <>
      <PageHeader title="留言板" description="路過的話，留個腳印吧。" />
      <Container className="py-12">
        <EmptyState
          title="留言板還沒開放"
          description="需要先接上資料庫與 GitHub 登入才能防止洗版，這部分排在階段 4 實作。"
        />
      </Container>
    </>
  );
}
