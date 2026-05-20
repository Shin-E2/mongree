"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import {
  deleteAllProfileComments,
  deleteProfileComment,
  deleteProfileDiaries,
  makePublicDiariesPrivate,
  updateProfile,
  type ProfileCommentItem,
  type ProfileDiaryDeleteScope,
  type ProfileDiaryItem,
  type ProfilePageData,
} from "./action";
import styles from "./styles.module.css";

interface ProfileSettingsClientProps {
  profile: NonNullable<ProfilePageData["profile"]>;
  comments: ProfileCommentItem[];
  diaries: ProfileDiaryItem[];
  summary: ProfilePageData["summary"];
}

type DiaryView = "all" | "private" | "public";

const diaryViewLabels: Record<DiaryView, string> = {
  all: "전체",
  private: "개인 일기",
  public: "공개 일기",
};

export default function ProfileSettingsClient({
  profile,
  comments,
  diaries,
  summary,
}: ProfileSettingsClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState(profile.nickname);
  const [previewImage, setPreviewImage] = useState(
    profile.profileImage ?? DEFAULT_PROFILE_IMAGE
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [diaryView, setDiaryView] = useState<DiaryView>("all");
  const [isPending, startTransition] = useTransition();

  const filteredDiaries = useMemo(() => {
    if (diaryView === "private") return diaries.filter((diary) => diary.isPrivate);
    if (diaryView === "public") return diaries.filter((diary) => !diary.isPrivate);
    return diaries;
  }, [diaries, diaryView]);

  useEffect(() => {
    if (!message) return;

    const timer = window.setTimeout(() => {
      setMessage("");
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setMessage("프로필 이미지는 JPG 또는 PNG만 사용할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setMessage("프로필 이미지는 3MB 이하만 사용할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (previewImage.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setMessage("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("nickname", nickname);
      if (selectedFile) formData.append("profileImage", selectedFile);

      const result = await updateProfile(formData);
      setMessage(result.success ? "프로필이 저장되었습니다." : result.error ?? "");

      if (result.success) {
        setSelectedFile(null);
        window.dispatchEvent(new Event("profile-updated"));
        router.refresh();
      }
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!window.confirm("이 댓글을 삭제하시겠습니까?")) return;

    startTransition(async () => {
      const result = await deleteProfileComment(commentId);
      setMessage(result.success ? "댓글을 삭제했습니다." : result.error ?? "");
      if (result.success) router.refresh();
    });
  };

  const handleDeleteAllComments = () => {
    if (comments.length === 0) return;
    if (!window.confirm("내 댓글을 모두 삭제하시겠습니까?")) return;

    startTransition(async () => {
      const result = await deleteAllProfileComments();
      setMessage(result.success ? "댓글을 모두 삭제했습니다." : result.error ?? "");
      if (result.success) router.refresh();
    });
  };

  const handleDeleteDiaries = (scope: ProfileDiaryDeleteScope) => {
    const label =
      scope === "private" ? "비공개 일기" : scope === "public" ? "공개 일기" : "모든 일기";

    if (!window.confirm(`${label}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProfileDiaries(scope);
      setMessage(
        result.success
          ? `${result.count ?? 0}개의 일기를 삭제했습니다.`
          : result.error ?? ""
      );
      if (result.success) router.refresh();
    });
  };

  const handleMakePublicPrivate = () => {
    if (!window.confirm("공개 일기를 모두 비공개로 전환하시겠습니까?")) return;

    startTransition(async () => {
      const result = await makePublicDiariesPrivate();
      setMessage(
        result.success
          ? `${result.count ?? 0}개의 공개 일기를 비공개로 바꿨습니다.`
          : result.error ?? ""
      );
      if (result.success) router.refresh();
    });
  };

  const handleCheckout = () => {
    startTransition(async () => {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
      });
      const result = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      setMessage(result.error ?? "결제 페이지를 열 수 없습니다.");
    });
  };

  return (
    <div className={styles.interactiveGrid}>
      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>프로필 정보</h2>
            <p className={styles.panelDescription}>
              공개 일기와 댓글에 표시되는 정보
            </p>
          </div>
        </div>

        <form className={styles.profileForm} onSubmit={handleSubmit}>
          <div className={styles.avatarEditor}>
            <ImageThumbnail
              src={previewImage}
              alt={nickname}
              width={96}
              height={96}
              shape="circle"
              className={styles.avatarImage}
            />
            <div className={styles.avatarActions}>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                사진 변경
              </button>
              <p className={styles.fieldHint}>JPG, PNG 최대 3MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              className={styles.fileInput}
              onChange={handleImageChange}
            />
          </div>

          <label className={styles.fieldGroup}>
            <span className={styles.label}>닉네임</span>
            <input
              className={styles.textInput}
              value={nickname}
              maxLength={20}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="닉네임을 입력하세요"
            />
            <span className={styles.fieldHint}>{nickname.length}/20, 2글자 이상</span>
          </label>

          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isPending || nickname.trim().length < 2}
          >
            {isPending ? "저장 중..." : "프로필 저장"}
          </button>
        </form>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>내 일기 관리</h2>
            <p className={styles.panelDescription}>
              개인 일기와 공개 일기를 따로 확인하고 정리합니다.
            </p>
          </div>
        </div>

        <div className={styles.diaryManageSummary}>
          <span>전체 {summary.diaryCount}</span>
          <span>개인 {summary.privateDiaryCount}</span>
          <span>공개 {summary.publicDiaryCount}</span>
        </div>

        <div className={styles.segmentedControl}>
          {(Object.keys(diaryViewLabels) as DiaryView[]).map((view) => (
            <button
              key={view}
              type="button"
              className={`${styles.segmentButton} ${
                diaryView === view ? styles.segmentButtonActive : ""
              }`}
              onClick={() => setDiaryView(view)}
            >
              {diaryViewLabels[view]}
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
                  <p className={styles.commentMeta}>
                    {diary.isPrivate ? "개인 일기" : "공개 일기"}
                  </p>
                </div>
                <p className={styles.commentContent}>{diary.content}</p>
                <Link href={`/diary/${diary.id}`} className={styles.commentLink}>
                  일기에서 보기
                </Link>
              </article>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>표시할 일기가 없습니다</p>
              <p className={styles.emptyDescription}>
                선택한 범위에 맞는 기록이 없습니다.
              </p>
            </div>
          )}
        </div>
      </section>

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

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>내 댓글</h2>
            <p className={styles.panelDescription}>
              최근 댓글을 모아보고 정리합니다.
            </p>
          </div>
          <button
            type="button"
            className={styles.dangerTextButton}
            onClick={handleDeleteAllComments}
            disabled={isPending || comments.length === 0}
          >
            전체 삭제
          </button>
        </div>

        <div className={styles.commentList}>
          {comments.length > 0 ? (
            comments.map((comment) => (
              <article key={comment.id} className={styles.commentCard}>
                <div className={styles.commentHeader}>
                  <div>
                    <p className={styles.commentDiaryTitle}>
                      {comment.diaryTitle}
                    </p>
                    <p className={styles.commentMeta}>
                      {comment.isReply ? "답글" : "댓글"}
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isPending}
                  >
                    삭제
                  </button>
                </div>
                <p className={styles.commentContent}>{comment.content}</p>
                <Link
                  href={`/diary/${comment.diaryId}`}
                  className={styles.commentLink}
                >
                  일기에서 보기
                </Link>
              </article>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>작성한 댓글이 없습니다</p>
              <p className={styles.emptyDescription}>
                공개 일기에 마음을 남기면 이곳에서 확인할 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {message && <p className={styles.toastMessage}>{message}</p>}
    </div>
  );
}
