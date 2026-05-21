"use client";

import { usePathname } from "next/navigation";
import { URL } from "@/commons/constants/global-url";
import { NAV_ITEMS } from "@/components/layout/sidebar/navigation/constants";

const PAGE_TITLE_MAP = new Map<string, string>([
  ...NAV_ITEMS.map((item): [string, string] => [item.path, item.pageTitle]),
  [URL().DIARY_NEW, "오늘 일기 쓰기"],
  [URL().PROFILE, "내 프로필"],
  [URL().COUNSELORS, "상담사 찾기"],
]);

export function usePageTitle() {
  const pathname = usePathname();
  const exact = PAGE_TITLE_MAP.get(pathname);
  if (exact) return exact;

  if (pathname.startsWith(URL().DIARY)) {
    return "일기 조각";
  }

  return "Mongree";
}
