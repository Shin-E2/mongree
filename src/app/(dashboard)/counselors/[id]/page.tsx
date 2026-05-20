import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { counselors, getCounselor } from "../data";
import styles from "../styles.module.css";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return counselors.map((counselor) => ({ id: counselor.id }));
}

export default async function CounselorDetailPage({ params }: Props) {
  const { id } = await params;
  const counselor = getCounselor(id);

  if (!counselor) {
    notFound();
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.detailWrapper}>
        <Link className={styles.backLink} href="/counselors">
          <ArrowLeft className={styles.linkIcon} aria-hidden="true" />
          상담사 목록
        </Link>

        <section className={styles.detailHero}>
          <div>
            <p className={styles.eyebrow}>{counselor.experience}</p>
            <h2 className={styles.detailName}>{counselor.name}</h2>
            <p className={styles.detailSummary}>{counselor.summary}</p>
          </div>
          <div className={styles.bookingPanel}>
            <span className={styles.panelLabel}>가장 빠른 상담</span>
            <strong>{counselor.nextSlot}</strong>
            <Link className={styles.bookingButton} href="/profile">
              상담 신청
            </Link>
          </div>
        </section>

        <section className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>상담 방식</h3>
          <p className={styles.bodyText}>{counselor.approach}</p>
          <div className={styles.methodGrid}>
            {counselor.sessionTypes.map((type) => (
              <div className={styles.methodItem} key={type}>
                <MessageCircle className={styles.methodIcon} aria-hidden="true" />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>전문 분야</h3>
          <ul className={styles.checkList}>
            {counselor.specialties.map((specialty) => (
              <li key={specialty}>
                <CheckCircle2 className={styles.checkIcon} aria-hidden="true" />
                {specialty}
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>가능 시간</h3>
          <ul className={styles.timeList}>
            {counselor.availableTimes.map((time) => (
              <li key={time}>
                <CalendarClock className={styles.checkIcon} aria-hidden="true" />
                {time}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
