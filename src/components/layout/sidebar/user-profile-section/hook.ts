"use client";

import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { getUser } from "@/lib/get-user";
import React, { useState, useRef, useEffect } from "react";

export default function useSidebarUserProfileSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운
  const [user, setUser] = useState<{
    name: string;
    profileImage: string;
  } | null>(null);

  // DOM 요소: useRef, dropdownRef.current는 실제 DOM 요소에 접근 가능
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    const fetchUser = async () => {
      try {
        const userData = await getUser();
        setUser({
          name: userData.name!,
          profileImage: userData.profileImage!,
        });
      } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
        // 기본값 설정 또는 에러 처리
        setUser({ name: "사용자", profileImage: DEFAULT_PROFILE_IMAGE });
      }
    };

    fetchUser();
  }, []);

  // esc 키 입력 감지를 위한 키보드 이벤트 핸들러
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") setIsDropdownOpen(false);
  };

  return {
    dropdownRef,
    handleKeyDown,
    setIsDropdownOpen,
    isDropdownOpen,
    user,
  };
}
