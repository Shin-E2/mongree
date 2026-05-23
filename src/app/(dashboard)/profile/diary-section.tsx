"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import {
  deleteProfileDiaries,
  makePublicDiariesPrivate,
  type ProfileDiaryDeleteScope,
  type ProfileDiaryItem,
  type ProfilePageData,
} from "./action";
import styles from "./styles.module.css";

type DiaryView = "all" | "private" | "public";

const DIARY_VIEW_LABELS: Record<DiaryView, string> = {
  all: "전체",
  private: "개인 일기",
  public: "공개 일기",
};

interface DiarySectionProps {
  diaries: ProfileDiaryItem[];
  summary: ProfilePageData["summary"];
  onMessage: (msg: string) => void;
  onRefresh: () => void;
}

export function DiarySection({ diaries, summary, onMessage, onRefresh }: DiarySectionProps) {
  const [diaryView, setDiaryView] = useState<DiaryView>("all");
  const [isPending, startTransition] = useTransition();

  const filteredDiaries = useMemo(() => {
    if (diaryView === "private") return diaries.filter((d) => d.isPrivate);
    if (diaryView === "public") return diaries.filter((d) => !d.isPrivate);
    return diaries;
  }, [diaries, diaryView]);

  const handleDeleteDiaries = (scope: ProfileDiaryDeleteScope) => {
    const label =
      scope === "private" ? "비공개 일기" : scope === "public" ? "공개 일기" : "모든 일기";
    if (!window.confirm(`${label}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;

    startTransition(async () => {
      const result = await deleteProfileDiaries(scope);
      onMessage(
        result.success ? `${result.count ?? 0}개의 일기를 삭제했습니다.` : result.error ?? ""
      );
      if (result.success) onRefresh();
    });
  };

  const handleMakePublicPrivate = () => {
    if (!window.confirm("공개 일기를 모두 비공개로 전환하시겠습니까?")) return;

    startTransition(async () => {
      const result = await makePublicDiariesPrivate();
      onMessage(
        result.success
          ? `${result.count ?? 0}개의 공개 일기를 비공개로 바꿨습니다.`
          : result.error ?? ""
      );
      if (result.success) onRefresh();
    });
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>내 일기 관리</h2>
          <p className={styles.panelDescription}>개인 일기와 공개 일기를 따로 확인하고 정리합니다.</p>
        </div>
      </div>

      <div className={styles.diaryManageSummary}>
        <span>전체 {summary.diaryCount}</span>
        <span>개인 {summary.privateDiaryCount}</span>
        <span>공개 {summary.publicDiaryCount}</span>
      </div>

      <div className={styles.segmentedControl}>
        {(Object.keys(DIARY_VIEW_LABELS) as DiaryView[]).map((view) => (
          <button
            key={view}
            type="button"
            className={`${styles.segmentButton} ${diaryView === view ? styles.segmentButtonActive : ""}`}
            onClick={() => setDiaryView(view)}
          >
            {DIARY_VIEW_LABELS[view]}
          </button>
        ))}
      </div>

      <div className={styles.dangerActionGrid}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={handleMakePublicPrivate}
          disabled={isPending || summary.publicDiaryCount === 0}
        >
          공개 일기 비공개 전환
        </button>
        <button
          type="button"
          className={styles.dangerTextButton}
          onClick={() => handleDeleteDiaries("private")}
          disabled={isPending || summary.privateDiaryCount === 0}
        >
          비공개 일기 삭제
        </button>
        <button
          type="button"
          className={styles.dangerTextButton}
          onClick={() => handleDeleteDiaries("public")}
          disabled={isPending || summary.publicDiaryCount === 0}
        >
          공개 일기 삭제
        </button>
        <button
          type="button"
          className={styles.dangerTextButton}
          onClick={() => handleDeleteDiaries("all")}
          disabled={isPending || summary.diaryCount === 0}
        >
          모든 일기 삭제
        </button>
      </div>

      <div className={styles.diaryList}>
        {filteredDiaries.length > 0 ? (
          filteredDiaries.map((diary) => (
            <article key={diary.id} className={styles.diaryManageCard}>
              <div>
                <p className={styles.commentDiaryTitle}>{diary.title}</p>
                <p className={styles.commentMeta}>{diary.isPrivate ? "개인 일기" : "공개 일기"}</p>
              </div>
              <p className={styles.commentContent}>{diary.content}</p>
              <Link href={`/diary/${diary.id}`} className={styles.commentLink}>일기에서 보기</Link>
            </article>
          ))
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>표시할 일기가 없습니다</p>
            <p className={styles.emptyDescription}>선택한 범위에 맞는 기록이 없습니다.</p>
          </div>
        )}
      </div>
    </section>
  );
}
