"use client";

import { URL } from "@/commons/constants/global-url";
import { usePathname } from "next/navigation";

// 레이아웃 숨김
const HIDE_FULL_LAYOUT_PATHS = [URL().LOGIN, URL().SIGNUP, URL().DIARY_NEW];

export default function useLayout() {
  const pathname = usePathname();

  // 전체 레이아웃 숨김
  const shouldHideFullLayout = HIDE_FULL_LAYOUT_PATHS.includes(pathname);

  return {
    hideFullLayout: shouldHideFullLayout,
    hidePartialLayout: false,
  };
}
