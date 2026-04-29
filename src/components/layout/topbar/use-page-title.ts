"use client";

import { usePathname } from "next/navigation";
import { URL } from "@/commons/constants/global-url";
import { NAV_ITEMS } from "@/components/layout/sidebar/navigation/constants";

const STATIC_PAGE_TITLES: Record<string, string> = {
  [URL().DIARY_NEW]: "오늘 일기 쓰기",
  [URL().PROFILE]: "내 프로필",
  [URL().COUNSELORS]: "상담사 찾기",
};

export function usePageTitle() {
  const pathname = usePathname();
  const navTitle = NAV_ITEMS.find((item) => pathname === item.path)?.pageTitle;

  if (navTitle) {
    return navTitle;
  }

  if (STATIC_PAGE_TITLES[pathname]) {
    return STATIC_PAGE_TITLES[pathname];
  }

  if (pathname.startsWith(URL().DIARY)) {
    return "일기 조각";
  }

  return "Mongree";
}
