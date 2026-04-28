"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import {
  deleteAllProfileComments,
  deleteProfileComment,
  updateProfile,
  type ProfileCommentItem,
  type ProfilePageData,
} from "./action";
import styles from "./styles.module.css";

interface ProfileSettingsClientProps {
  profile: NonNullable<ProfilePageData["profile"]>;
  comments: ProfileCommentItem[];
}

export default function ProfileSettingsClient({
  profile,
  comments,
}: ProfileSettingsClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState(profile.nickname);
  const [previewImage, setPreviewImage] = useState(
    profile.profileImage ?? DEFAULT_PROFILE_IMAGE
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

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
      if (selectedFile) {
        formData.append("profileImage", selectedFile);
      }

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
    if (!window.confirm("내가 쓴 댓글을 모두 삭제하시겠습니까?")) return;

    startTransition(async () => {
      const result = await deleteAllProfileComments();
      setMessage(
        result.success ? "내 댓글을 모두 삭제했습니다." : result.error ?? ""
      );
      if (result.success) router.refresh();
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
            <span className={styles.fieldHint}>
              {nickname.length}/20 · 2글자 이상
            </span>
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
            <h2 className={styles.panelTitle}>내 댓글</h2>
            <p className={styles.panelDescription}>
              최근 댓글을 모아보고 정리할 수 있습니다
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
                공개 일기에 마음을 남기면 이곳에서 한 번에 볼 수 있습니다.
              </p>
            </div>
          )}
        </div>
      </section>

      {message && <p className={styles.toastMessage}>{message}</p>}
    </div>
  );
}
