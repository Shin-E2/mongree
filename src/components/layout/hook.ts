"use client";

import { URL } from "@/commons/constants/global-url";
import { usePathname } from "next/navigation";

// 레이아웃 숨김
const HIDE_FULL_LAYOUT_PATHS = [URL().LOGIN, URL().SIGNUP, URL().DIARY_NEW];

// topbar, chatbot 숨김
const HIDE_PARTIAL_LAYOUT_PATTERN = /^\/diary\/[^/]+$/; // /diary/{id}

export default function useLayout() {
  const pathname = usePathname();

  // 전체 레이아웃 숨김
  const shouldHideFullLayout = HIDE_FULL_LAYOUT_PATHS.includes(pathname);

  // 부분 레이아웃(TopBar, ChatBot) 숨김
  const shouldHidePartialLayout = HIDE_PARTIAL_LAYOUT_PATTERN.test(pathname);

  return {
    hideFullLayout: shouldHideFullLayout,
    hidePartialLayout: shouldHidePartialLayout,
  };
}
