import type { Metadata } from "next";
import styles from "../terms/styles.module.css";

export const metadata: Metadata = {
  title: "개인정보처리방침 | Mongree",
  description: "Mongree 개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>개인정보처리방침</h1>
      <p className={styles.updated}>시행일: 2026년 5월 23일</p>

      <section className={styles.section}>
        <h2>1. 수집하는 개인정보 항목</h2>
        <ul>
          <li>필수: 이메일 주소, 닉네임</li>
          <li>선택: 프로필 사진</li>
          <li>자동 수집: 접속 IP, 브라우저 종류, 서비스 이용 기록</li>
          <li>일기 작성 시: 감정 기록, 텍스트 내용, 이미지(선택)</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>2. 개인정보 수집 및 이용 목적</h2>
        <ul>
          <li>회원 식별 및 인증 서비스 제공</li>
          <li>감정 일기 저장 및 조회 서비스 제공</li>
          <li>AI 감정 리포트 생성 (동의한 이용자에 한함)</li>
          <li>서비스 운영 이상 감지 및 보안</li>
          <li>유료 구독 결제 처리 (Stripe 위탁)</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. 개인정보 보유 및 이용 기간</h2>
        <p>
          회원 탈퇴 시 즉시 삭제합니다. 단, 관련 법령에 의해 보존 의무가 있는 정보는
          해당 기간 동안 보존합니다 (전자상거래법: 5년, 통신비밀보호법: 3개월).
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. 개인정보 제3자 제공 및 위탁</h2>
        <p>이용자의 개인정보는 원칙적으로 외부에 제공하지 않습니다. 다만 아래 업체에 업무를 위탁합니다.</p>
        <ul>
          <li>Stripe (결제 처리): 결제 정보 처리 및 저장</li>
          <li>AWS (이미지 저장): S3 기반 사진 저장</li>
          <li>Supabase (데이터베이스): 회원 정보 및 일기 데이터 저장</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>5. 비공개 일기 보호</h2>
        <p>
          비공개로 설정한 일기는 본인만 조회할 수 있습니다. Mongree 운영자를 포함한
          제3자는 이용자의 비공개 일기를 열람할 수 없습니다. AI 리포트 생성에 사용되는
          일기 데이터는 이용자 본인의 동의 후에만 처리됩니다.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. 이용자의 권리</h2>
        <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다.</p>
        <ul>
          <li>개인정보 조회 및 수정</li>
          <li>개인정보 삭제 요청 (회원 탈퇴)</li>
          <li>처리 정지 요청</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>7. 개인정보 보호 책임자</h2>
        <p>
          개인정보 보호 관련 문의는 서비스 내 문의하기 또는
          sinhyejee322@gmail.com으로 연락하십시오.
        </p>
      </section>
    </main>
  );
}
