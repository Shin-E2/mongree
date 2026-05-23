import type { Metadata } from "next";
import styles from "../terms/styles.module.css";

export const metadata: Metadata = {
  title: "AI 리포트 안내 | Mongree",
  description: "Mongree AI 감정 리포트 이용 안내 및 주의사항",
};

export default function AiDisclaimerPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>AI 리포트 안내</h1>
      <p className={styles.updated}>시행일: 2026년 5월 23일</p>

      <section className={styles.section}>
        <h2>AI 리포트는 무엇인가요?</h2>
        <p>
          Mongree AI 리포트는 이용자가 작성한 감정 일기를 바탕으로 월별 감정 패턴과
          주요 감정 흐름을 요약한 자기 성찰 보조 도구입니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>중요 안내 — 반드시 읽어주세요</h2>
        <ul>
          <li>
            <strong>의료 진단이 아닙니다.</strong> AI 리포트는 감정 기록을 바탕으로 한
            통계적 요약이며, 정신건강 진단이나 의학적 소견을 제공하지 않습니다.
          </li>
          <li>
            <strong>전문 상담의 대체재가 아닙니다.</strong> 심리적 어려움을 겪고 있다면
            정신건강 전문가의 상담을 받으시기 바랍니다.
          </li>
          <li>
            <strong>오류가 있을 수 있습니다.</strong> AI는 일기 내용을 기반으로 패턴을
            분석하지만, 결과가 실제 감정 상태와 다를 수 있습니다.
          </li>
          <li>
            <strong>개인 정보 처리.</strong> AI 리포트 생성 시 해당 월의 일기 내용이
            처리됩니다. 비공개 일기는 본인 외 열람 불가하며, AI 처리 후 원문은 외부에
            저장되지 않습니다.
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>긴급 상황 대응</h2>
        <p>
          자해, 자살 충동, 심각한 정신건강 위기 상황에서는 즉시 전문 기관에 연락하세요.
        </p>
        <ul>
          <li>자살예방상담전화: <strong>1393</strong> (24시간)</li>
          <li>정신건강위기상담전화: <strong>1577-0199</strong> (24시간)</li>
          <li>생명의전화: <strong>1588-9191</strong> (24시간)</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>AI 리포트 동의 및 철회</h2>
        <p>
          AI 리포트는 이용자가 명시적으로 요청할 때만 생성됩니다. 동의 철회 또는
          기존 리포트 삭제를 원하시면 프로필 설정 또는 문의하기를 이용하십시오.
        </p>
      </section>
    </main>
  );
}
