"use client";

import { URL } from "@/commons/constants/global-url";
import { usePathname } from "next/navigation";



export default function useLayout() {
  const pathname = usePathname();
  const { LOGIN, SIGNUP, DIARY } = URL();

  // 레이아웃이 숨겨질 경로
  const HIDDEN_LAYOUT = [LOGIN, SIGNUP];

  // 다이어리 상세 페이지 체크
  const isDiaryDetailPage =
    pathname?.startsWith("/diary/") && pathname !== DIARY;

  // 레이아웃을 숨길지 결정
  const hideLayout = HIDDEN_LAYOUT.includes(pathname) || isDiaryDetailPage;

  return { hideLayout };
}
