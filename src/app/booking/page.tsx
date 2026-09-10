import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { Container } from "@/components/container";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "預約諮詢",
  description: "留下孩子的狀況與你的聯絡方式，tutu 老師會盡快回覆你。",
};

export default function BookingPage() {
  return (
    <>
      <PageHeader
        title="預約諮詢"
        description="留下你的狀況與聯絡方式，我會在兩個工作天內回覆。"
      />
      <Container className="py-12">
        <BookingForm />
      </Container>
    </>
  );
}
