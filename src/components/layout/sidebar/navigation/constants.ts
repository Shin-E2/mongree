import {
  Home,
  BarChart2,
  BookHeart,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";
import { URL } from "@/commons/constants/global-url";
import type { NavItem } from "./types";

// 데스크탑
export const NAV_ITEMS: NavItem[] = [
  { icon: BookHeart, label: "나의 일기", path: URL().DIARY },
  { icon: Calendar, label: "감정 캘린더", path: URL().CALENDAR },
  { icon: BarChart2, label: "감정 통계", path: URL().STATISTICS },
  { icon: BookOpen, label: "공개 일기", path: URL().COMMUNITY },
  { icon: User, label: "상담사 찾기", path: URL().COUNSELORS },
];

// 모바일
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { icon: BookHeart, label: "나의 일기", path: URL().DIARY },
  { icon: Calendar, label: "감정 캘린더", path: URL().CALENDAR },
  { icon: Home, label: "", path: URL().HOME },
  { icon: BarChart2, label: "감정 통계", path: URL().STATISTICS },
  { icon: BookOpen, label: "공개 일기", path: URL().COMMUNITY },
  // { icon: User, label: "상담사 찾기", path: URL().COUNSELORS },
];
