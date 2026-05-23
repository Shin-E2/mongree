"use client";

import { useTransition } from "react";
import { usePostHog } from "posthog-js/react";
import styles from "./styles.module.css";

interface BillingSectionProps {
  onMessage: (msg: string) => void;
}

export function BillingSection({ onMessage }: BillingSectionProps) {
  const [isPending, startTransition] = useTransition();
  const posthog = usePostHog();

  const handleCheckout = () => {
    posthog?.capture("checkout_clicked", { plan: "pro" });
    startTransition(async () => {
      const response = await fetch("/api/billing/checkout", { method: "POST" });
      const result = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      onMessage(result.error ?? "결제 페이지를 열 수 없습니다.");
    });
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>구독 및 결제</h2>
          <p className={styles.panelDescription}>
            AI 리포트와 확장 기능을 위한 결제 상태를 관리합니다.
          </p>
        </div>
      </div>

      <div className={styles.billingBox}>
        <div>
          <p className={styles.billingTitle}>Mongree Plus</p>
          <p className={styles.billingDescription}>
            Stripe Checkout으로 구독을 시작합니다. 결제 환경이 준비되지
            않았다면 안내 메시지가 표시됩니다.
          </p>
        </div>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleCheckout}
          disabled={isPending}
        >
          {isPending ? "결제 연결 중..." : "구독 결제 시작"}
        </button>
      </div>
    </section>
  );
}
