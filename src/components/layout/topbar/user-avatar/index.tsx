"use client";

import Image from "next/image";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getUser } from "@/lib/get-user";
import { logOut } from "@/lib/logout";
import { URL } from "@/commons/constants/global-url";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import styles from "./styles.module.css";

interface UserProfile {
  nickname: string;
  profile_image: string | null;
}

export default function TopbarUserAvatar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    try {
      const data = await getUser();
      if (data) setUser({ nickname: data.nickname, profile_image: data.profile_image });
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    window.addEventListener("profile-updated", fetchUser);
    return () => window.removeEventListener("profile-updated", fetchUser);
  }, [fetchUser]);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const avatarSrc = user?.profile_image ?? DEFAULT_PROFILE_IMAGE;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        type="button"
        className={styles.avatarButton}
        onClick={() => setOpen((v) => !v)}
        aria-label="내 프로필"
        aria-expanded={open}
      >
        <Image
          src={avatarSrc}
          alt={user?.nickname ?? "프로필"}
          width={32}
          height={32}
          className={styles.avatarImage}
        />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {user && (
            <div className={styles.dropdownHeader}>
              <span className={styles.nickname}>{user.nickname}</span>
            </div>
          )}
          <Link href={URL().PROFILE} className={styles.dropdownItem} onClick={() => setOpen(false)}>
            <Settings className={styles.dropdownIcon} />
            <span>프로필 설정</span>
          </Link>
          <button type="button" className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`} onClick={logOut}>
            <LogOut className={styles.dropdownIcon} />
            <span>로그아웃</span>
          </button>
        </div>
      )}
    </div>
  );
}
