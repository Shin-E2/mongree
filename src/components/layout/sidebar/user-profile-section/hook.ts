"use client";

import { getUser } from "@/lib/get-user";
import React, { useState, useRef, useEffect, useCallback } from "react";

interface UserProfileForSidebar {
  id: string;
  nickname: string;
  profile_image: string | null;
}

export default function useSidebarUserProfileSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운
  // 사용자 정보 상태 타입을 profiles 테이블 기반으로 변경
  const [user, setUser] = useState<UserProfileForSidebar | null>(null);

  // DOM 요소: useRef, dropdownRef.current는 실제 DOM 요소에 접근 가능
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await getUser();
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

  // 드롭다운 바깥? 클릭시
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // contains(): 한 요소가 다른 요소를 포함하는지 확인하는 DOM api
      if (
        dropdownRef.current && // 횬재 dropdownRef가 존재하고
        !dropdownRef.current.contains(event.target as Node) // 클릭된 요소가 드롭다운 내부가 아니라면
      )
        setIsDropdownOpen(false); // 드롭다운을 닫음
    };

    // 드롭다운이 열려있을 때
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // 클린업 함수: 의존성 배열 값 변경 시 실행 ---> 메모리 누수 방지
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // 사용자 정보 불러오기
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 프로필 저장 후 사이드바 최신화
  useEffect(() => {
    window.addEventListener("profile-updated", fetchUser);

    return () => {
      window.removeEventListener("profile-updated", fetchUser);
    };
  }, [fetchUser]);

  // esc 키 입력 감지를 위한 키보드 이벤트 핸들러
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
