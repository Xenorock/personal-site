import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";

// 表單本體保留在 @/components/booking-form，日後要開放時：
// 1. 把這個頁面換回 <BookingForm />
// 2. 在 site-config 的 navLinks 加回「預約諮詢」
export const metadata: Metadata = {
  title: "預約諮詢",
  description: "線上預約功能準備中。",
  robots: { index: false },
};

export default function BookingPage() {
  return (
    <>
      <PageHeader title="預約諮詢" description="這個功能還在準備中。" />
      <Container className="py-12">
        <EmptyState
          title="線上預約尚未開放"
          description="表單功能正在準備，開放後就能直接在這裡送出諮詢需求。"
        />
        <div className="mt-8 text-center">
          <Link
            href="/games"
            className="inline-block rounded-2xl bg-accent px-7 py-4 font-bold text-accent-foreground transition-transform hover:scale-105"
          >
            先去玩遊戲
          </Link>
        </div>
      </Container>
    </>
  );
}
