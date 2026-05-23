"use client";

import { type ChangeEvent, type FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { updateProfile, type ProfilePageData } from "./action";
import styles from "./styles.module.css";

interface ProfileSectionProps {
  profile: NonNullable<ProfilePageData["profile"]>;
  onMessage: (msg: string) => void;
  onRefresh: () => void;
}

export function ProfileSection({ profile, onMessage, onRefresh }: ProfileSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState(profile.nickname);
  const [previewImage, setPreviewImage] = useState(profile.profileImage ?? DEFAULT_PROFILE_IMAGE);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    return () => {
      if (previewImage.startsWith("blob:")) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      onMessage("프로필 이미지는 JPG 또는 PNG만 사용할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      onMessage("프로필 이미지는 3MB 이하만 사용할 수 있습니다.");
      event.target.value = "";
      return;
    }

    if (previewImage.startsWith("blob:")) URL.revokeObjectURL(previewImage);
    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("nickname", nickname);
      if (selectedFile) formData.append("profileImage", selectedFile);

      const result = await updateProfile(formData);
      onMessage(result.success ? "프로필이 저장되었습니다." : result.error ?? "");

      if (result.success) {
        setSelectedFile(null);
        window.dispatchEvent(new Event("profile-updated"));
        onRefresh();
      }
    });
  };

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h2 className={styles.panelTitle}>프로필 정보</h2>
          <p className={styles.panelDescription}>공개 일기와 댓글에 표시되는 정보</p>
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
  );
}
