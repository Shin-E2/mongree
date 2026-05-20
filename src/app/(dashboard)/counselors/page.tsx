import {
  ArrowRight,
  CalendarClock,
  MessageCircle,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { counselors } from "./data";
import styles from "./styles.module.css";

export default function CounselorListPage() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <section className={styles.summaryBand} aria-label="상담 안내">
          <div className={styles.summaryItem}>
            <ShieldCheck className={styles.summaryIcon} aria-hidden="true" />
            <span>몽그리 감정 기록 기반 상담 준비</span>
          </div>
          <div className={styles.summaryItem}>
            <CalendarClock className={styles.summaryIcon} aria-hidden="true" />
            <span>가능한 시간 확인 후 신청</span>
          </div>
          <div className={styles.summaryItem}>
            <MessageCircle className={styles.summaryIcon} aria-hidden="true" />
            <span>영상, 전화, 채팅 상담 선택</span>
          </div>
        </section>

        <div className={styles.counselorGrid}>
          {counselors.map((counselor) => (
            <article className={styles.card} key={counselor.id}>
              <div className={styles.cardHeader}>
                <div>
                  <p className={styles.eyebrow}>{counselor.experience}</p>
                  <h2 className={styles.name}>{counselor.name}</h2>
                  <p className={styles.title}>{counselor.title}</p>
                </div>
                <span className={styles.nextSlot}>{counselor.nextSlot}</span>
              </div>

              <p className={styles.description}>{counselor.summary}</p>

              <ul
                className={styles.tags}
                aria-label={`${counselor.name} 전문 분야`}
              >
                {counselor.specialties.map((specialty) => (
                  <li className={styles.tag} key={specialty}>
                    {specialty}
                  </li>
                ))}
              </ul>

              <Link
                className={styles.detailLink}
                href={`/counselors/${counselor.id}`}
              >
                자세히 보기
                <ArrowRight className={styles.linkIcon} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
