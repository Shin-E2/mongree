"use client";

import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import { getUser } from "@/lib/get-user";
import React, { useState, useRef, useEffect } from "react";
import { Database } from "@/lib/supabase.types"; // Database 타입 임포트

// profiles 테이블의 필요한 필드 타입 정의
type UserProfileForSidebar = Pick<Database['public']['Tables']['profiles']['Row'], 'user_id' | 'username' | 'profile_image'>;

export default function useSidebarUserProfileSection() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운
  // 사용자 정보 상태 타입을 profiles 테이블 기반으로 변경
  const [user, setUser] = useState<UserProfileForSidebar | null>(null);

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
        if (userData) {
          // profiles 테이블 스키마에 맞게 필드 매핑
        setUser({
            user_id: userData.user_id!, // user_id 필드 사용
            username: userData.username!, // name 대신 username 사용
            profile_image: userData.profile_image!, // profileImage 대신 profile_image 사용
        });
        } else {
          // 사용자 데이터가 없을 경우 기본값 설정
          setUser(null); // 사용자 데이터가 없을 경우 null로 설정
        }
      } catch (error) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", error);
        // 에러 발생 시 기본값 설정 또는 null
        setUser(null); // 에러 발생 시 null로 설정
      }
    };

    fetchUser();
  }, []);

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
