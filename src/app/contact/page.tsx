import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "聯絡",
  description: "有事想找我聊聊嗎？",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        title="聯絡我"
        description="合作邀約、技術討論，或只是想打聲招呼都可以。"
      />
      <Container className="py-12">
        <ContactForm />
      </Container>
    </>
  );
}
