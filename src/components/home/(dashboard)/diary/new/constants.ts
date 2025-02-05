import DiaryNewStepSelectEmotions from "@/components/home/(dashboard)/diary/new/step-select-emotions";
import DiaryNewStepWriteDiary from "@/components/home/(dashboard)/diary/new/step-write-diary";

// 일기 작성 단계
export const DIARY_NEW_STEPS = [
  {
    id: 1,
    Component: DiaryNewStepSelectEmotions, // 감정 선택
  },
  {
    id: 2,
    Component: DiaryNewStepWriteDiary, // 일기 작성
  },
] as const;
