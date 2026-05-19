import { getCurrentProfile } from "@/lib/get-user";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface UserProfileForSidebar {
  id: string;
  nickname: string;
  profile_image: string | null;
}

export default function useSidebarUserProfileSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserProfileForSidebar | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getCurrentProfile();
      if (userData) {
        setUser({
          id: userData.id,
          nickname: userData.nickname,
          profile_image: userData.profile_image,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("사용자 정보를 불러오는 중 오류 발생:", error);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    window.addEventListener("profile-updated", fetchUser);

    return () => {
      window.removeEventListener("profile-updated", fetchUser);
    };
  }, [fetchUser]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return {
    dropdownRef,
    handleKeyDown,
    setIsDropdownOpen,
    isDropdownOpen,
    user,
  };
}
