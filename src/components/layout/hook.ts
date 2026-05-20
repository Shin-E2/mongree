"use client";

import { URL } from "@/commons/constants/global-url";
import { usePathname } from "next/navigation";

// 레이아웃 숨김
const HIDE_FULL_LAYOUT_PATHS = [URL().LOGIN, URL().SIGNUP, URL().DIARY_NEW];

const isDiaryDetailPath = (pathname: string) =>
  /^\/diary\/[^/]+$/.test(pathname);

export default function useLayout() {
  const pathname = usePathname();

  // 전체 레이아웃 숨김
  const shouldHideFullLayout = HIDE_FULL_LAYOUT_PATHS.includes(pathname);
  const shouldHidePartialLayout = isDiaryDetailPath(pathname);

  return {
    hideFullLayout: shouldHideFullLayout,
    hidePartialLayout: shouldHidePartialLayout,
  };
}