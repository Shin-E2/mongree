import {
  Home,
  BarChart2,
  BrainCircuit,
  BookHeart,
  BookOpen,
  Calendar,
} from "lucide-react";
import { URL } from "@/commons/constants/global-url";
import type { NavItem } from "./types";

// 데스크탑
export const NAV_ITEMS: NavItem[] = [
  { icon: BookHeart, label: "나의 일기", path: URL().DIARY },
  { icon: Calendar, label: "감정 캘린더", path: URL().CALENDAR },
  { icon: BarChart2, label: "감정 통계", path: URL().STATISTICS },
  { icon: BookOpen, label: "공개 일기", path: URL().COMMUNITY },
  { icon: BrainCircuit, label: "AI 리포트", path: URL().AI_REPORT },
];

// 모바일
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { icon: BookHeart, label: "나의 일기", path: URL().DIARY },
  { icon: Calendar, label: "감정 캘린더", path: URL().CALENDAR },
  { icon: Home, label: "", path: URL().HOME },
  { icon: BrainCircuit, label: "AI 리포트", path: URL().AI_REPORT },
  { icon: BookOpen, label: "공개 일기", path: URL().COMMUNITY },
];
