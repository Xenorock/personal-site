"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  // 階段 4 會改成呼叫 /api/contact，這裡先只做前端驗證與送出回饋
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          你的名字
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={50}
          placeholder="王小明"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          訊息內容
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={1000}
          placeholder="想跟我說什麼？"
          className={`${inputClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        送出訊息
      </button>

      {submitted && (
        <p
          role="status"
          className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-muted-foreground"
        >
          表單格式沒問題。後端 API 還沒接上，實際寄送會在階段 4 完成。
        </p>
      )}
    </form>
  );
}
