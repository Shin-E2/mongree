import {
  BarChart2,
  BookHeart,
  BookOpen,
  BrainCircuit,
  Calendar,
  Home,
} from "lucide-react";
import { URL } from "@/commons/constants/global-url";
import type { NavItem } from "./types";

export const NAV_ITEMS: NavItem[] = [
  { icon: Home, label: "홈", pageTitle: "오늘의 하늘", path: URL().HOME },
  { icon: BookHeart, label: "나의 일기", pageTitle: "나의 일기", path: URL().DIARY },
  { icon: Calendar, label: "감정 캘린더", pageTitle: "감정 캘린더", path: URL().CALENDAR },
  { icon: BarChart2, label: "감정 통계", pageTitle: "감정 통계", path: URL().STATISTICS },
  { icon: BookOpen, label: "공개 일기", pageTitle: "공개 일기", path: URL().COMMUNITY },
  { icon: BrainCircuit, label: "AI 리포트", pageTitle: "AI 리포트", path: URL().AI_REPORT },
];

export const MOBILE_NAV_ITEMS: NavItem[] = [
  { icon: BookHeart, label: "나의 일기", pageTitle: "나의 일기", path: URL().DIARY },
  { icon: Calendar, label: "감정 캘린더", pageTitle: "감정 캘린더", path: URL().CALENDAR },
  { icon: Home, label: "", pageTitle: "오늘의 하늘", path: URL().HOME },
  { icon: BarChart2, label: "감정 통계", pageTitle: "감정 통계", path: URL().STATISTICS },
  { icon: BrainCircuit, label: "AI 리포트", pageTitle: "AI 리포트", path: URL().AI_REPORT },
  { icon: BookOpen, label: "공개 일기", pageTitle: "공개 일기", path: URL().COMMUNITY },
];