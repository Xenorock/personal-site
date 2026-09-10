"use client";

import { useState, type FormEvent } from "react";
import { services } from "@/data/services";

const fieldClass =
  "w-full rounded-2xl border-2 border-border bg-card px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground focus:border-accent";

export function BookingForm() {
  const [submitted, setSubmitted] = useState(false);

  // 階段 4 會改為呼叫 /api/booking，這裡先只做前端驗證與送出回饋
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="space-y-2">
        <label htmlFor="parent" className="font-medium">
          怎麼稱呼你
        </label>
        <input
          id="parent"
          name="parent"
          required
          maxLength={50}
          placeholder="王媽媽"
          className={fieldClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone" className="font-medium">
            電話 <span className="text-muted-foreground">（選填）</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            placeholder="09xx-xxx-xxx"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="childAge" className="font-medium">
            孩子年齡
          </label>
          <input
            id="childAge"
            name="childAge"
            required
            maxLength={20}
            placeholder="4 歲 3 個月"
            className={fieldClass}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="service" className="font-medium">
            想諮詢的項目
          </label>
          <select id="service" name="service" required className={fieldClass}>
            <option value="">請選擇</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.title}
              </option>
            ))}
            <option value="other">還不確定，想先聊聊</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="font-medium">
          想討論的狀況
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={1000}
          placeholder="簡單描述你觀察到的情形，或是最想解決的問題。"
          className={`${fieldClass} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="rounded-2xl bg-accent px-7 py-4 font-bold text-accent-foreground transition-transform hover:scale-105"
      >
        送出預約
      </button>

      <p className="text-sm leading-relaxed text-muted-foreground">
        你填寫的資訊只會用於安排諮詢，不會提供給第三方。
      </p>

      {submitted && (
        <p
          role="status"
          className="rounded-2xl border-2 border-border bg-muted px-5 py-4 leading-relaxed"
        >
          表單格式沒問題。後端還沒接上，實際送出與通知會在階段 4 完成。
        </p>
      )}
    </form>
  );
}
