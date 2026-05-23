import type { Metadata } from "next";
import styles from "./styles.module.css";

export const metadata: Metadata = {
  title: "이용약관 | Mongree",
  description: "Mongree 서비스 이용약관",
};

export default function TermsPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>이용약관</h1>
      <p className={styles.updated}>시행일: 2026년 5월 23일</p>

      <section className={styles.section}>
        <h2>제1조 (목적)</h2>
        <p>
          이 약관은 Mongree(이하 「서비스」)가 제공하는 감정 일기 서비스의 이용 조건 및
          절차에 관한 사항을 규정함을 목적으로 합니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>제2조 (정의)</h2>
        <ul>
          <li>「서비스」란 Mongree가 제공하는 감정 일기 기록, AI 리포트, 커뮤니티 기능 일체를 의미합니다.</li>
          <li>「이용자」란 이 약관에 동의하고 서비스를 이용하는 자를 말합니다.</li>
          <li>「일기」란 이용자가 서비스에 등록한 감정 기록, 텍스트, 이미지를 포함한 콘텐츠를 말합니다.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>제3조 (서비스 이용)</h2>
        <p>
          서비스는 만 14세 이상 이용 가능합니다. 이용자는 하나의 계정만 생성할 수 있으며,
          타인의 계정을 도용하거나 부정한 방법으로 서비스를 이용해서는 안 됩니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>제4조 (개인 일기 보호)</h2>
        <p>
          비공개로 설정된 일기는 본인 외 어떠한 사용자에게도 공개되지 않습니다.
          Mongree는 운영 및 서비스 개선 목적 외에 이용자의 일기 내용을 열람하지 않습니다.
          AI 리포트 생성 시에는 해당 이용자의 동의 하에 데이터가 처리됩니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>제5조 (금지 행위)</h2>
        <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
        <ul>
          <li>타인을 비방하거나 명예를 훼손하는 내용의 공개 일기 및 댓글 작성</li>
          <li>개인정보 침해, 저작권 침해, 불법 콘텐츠 게시</li>
          <li>서비스의 정상적 운영을 방해하는 행위</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>제6조 (서비스 중단 및 변경)</h2>
        <p>
          서비스는 시스템 유지보수, 장애, 기타 운영상의 이유로 사전 고지 후 일시 중단될 수 있습니다.
          중요 약관 변경 시 최소 7일 전 공지합니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>제7조 (준거법)</h2>
        <p>이 약관은 대한민국 법령에 따르며, 분쟁 발생 시 관할 법원은 서울중앙지방법원으로 합니다.</p>
      </section>
    </main>
  );
}
