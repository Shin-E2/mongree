import { URL } from "@/commons/constants/global-url";
import type { NavItem } from "./types";
import { BarChart2, BookHeart, BookOpen, Calendar, User } from "lucide-react";

export const NAV_ITEMS: NavItem[] = [
  { icon: BookHeart, label: "나의 일기", path: URL().DIARY },
  { icon: Calendar, label: "감정 캘린더", path: URL().CALENDAR },
  { icon: BarChart2, label: "감정 통계", path: URL().STATISTICS },
  { icon: BookOpen, label: "공개 일기", path: URL().COMMUNITY },
  { icon: User, label: "상담사 찾기", path: URL().COUNSELORS },
];
