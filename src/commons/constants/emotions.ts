import type { CSSProperties } from "react";

export type EmotionGroupId =
  | "joy"
  | "calm"
  | "sadness"
  | "anxiety"
  | "anger"
  | "loneliness"
  | "fatigue"
  | "reflection"
  | "confusion";

export interface EmotionGroup {
  id: EmotionGroupId;
  label: string;
  color: string;
  softColor: string;
  textColor: string;
  image: string;
}

export interface EmotionOption {
  id: string;
  groupId: EmotionGroupId;
  label: string;
  color: string;
  softColor: string;
  textColor: string;
  image: string;
  bgColor: string;
  borderColor: string;
  sortOrder: number;
}

export const EMOTION_GROUPS: EmotionGroup[] = [
  { id: "joy", label: "기쁨", color: "oklch(0.76 0.105 75)", softColor: "oklch(0.94 0.045 78)", textColor: "oklch(0.36 0.075 68)", image: "/image/emotions/joyful.svg" },
  { id: "calm", label: "평온", color: "oklch(0.72 0.07 155)", softColor: "oklch(0.93 0.035 155)", textColor: "oklch(0.34 0.055 155)", image: "/image/emotions/calm.svg" },
  { id: "sadness", label: "슬픔", color: "oklch(0.70 0.06 245)", softColor: "oklch(0.93 0.03 245)", textColor: "oklch(0.34 0.055 245)", image: "/image/emotions/sad.svg" },
  { id: "anxiety", label: "불안", color: "oklch(0.70 0.075 285)", softColor: "oklch(0.93 0.035 285)", textColor: "oklch(0.36 0.06 285)", image: "/image/emotions/anxious.svg" },
  { id: "anger", label: "분노", color: "oklch(0.68 0.10 25)", softColor: "oklch(0.93 0.04 25)", textColor: "oklch(0.38 0.075 25)", image: "/image/emotions/angry.svg" },
  { id: "loneliness", label: "외로움", color: "oklch(0.70 0.055 205)", softColor: "oklch(0.93 0.03 205)", textColor: "oklch(0.34 0.05 205)", image: "/image/emotions/confused.svg" },
  { id: "fatigue", label: "피로", color: "oklch(0.68 0.035 85)", softColor: "oklch(0.92 0.025 85)", textColor: "oklch(0.35 0.035 85)", image: "/image/emotions/disappointed.svg" },
  { id: "reflection", label: "자기감정", color: "oklch(0.68 0.07 335)", softColor: "oklch(0.93 0.035 335)", textColor: "oklch(0.36 0.06 335)", image: "/image/emotions/scared.svg" },
  { id: "confusion", label: "복잡함", color: "oklch(0.70 0.05 270)", softColor: "oklch(0.93 0.03 270)", textColor: "oklch(0.35 0.05 270)", image: "/image/emotions/confused.svg" },
];

const groupById = Object.fromEntries(EMOTION_GROUPS.map((group) => [group.id, group])) as Record<EmotionGroupId, EmotionGroup>;

function emotion(id: string, groupId: EmotionGroupId, label: string, sortOrder: number, image?: string): EmotionOption {
  const group = groupById[groupId];
  return {
    id,
    groupId,
    label,
    color: group.color,
    softColor: group.softColor,
    textColor: group.textColor,
    image: image ?? group.image,
    bgColor: "",
    borderColor: "",
    sortOrder,
  };
}

export const EMOTIONS: EmotionOption[] = [
  emotion("joyful", "joy", "기쁨", 1, "/image/emotions/joyful.svg"),
  emotion("happy", "joy", "행복", 2, "/image/emotions/happy.svg"),
  emotion("excited", "joy", "설렘", 3, "/image/emotions/excited.svg"),
  emotion("proud", "joy", "뿌듯함", 4),
  emotion("calm", "calm", "평온", 11, "/image/emotions/calm.svg"),
  emotion("relieved", "calm", "안도", 12),
  emotion("comfortable", "calm", "여유", 13),
  emotion("stable", "calm", "안정", 14),
  emotion("sad", "sadness", "슬픔", 21, "/image/emotions/sad.svg"),
  emotion("hurt", "sadness", "서운함", 22),
  emotion("loss", "sadness", "상실감", 23),
  emotion("empty", "sadness", "허전함", 24),
  emotion("anxious", "anxiety", "불안", 31, "/image/emotions/anxious.svg"),
  emotion("worried", "anxiety", "걱정", 32),
  emotion("nervous", "anxiety", "초조함", 33),
  emotion("scared", "anxiety", "두려움", 34, "/image/emotions/scared.svg"),
  emotion("angry", "anger", "분노", 41, "/image/emotions/angry.svg"),
  emotion("irritated", "anger", "짜증", 42),
  emotion("unfair", "anger", "억울함", 43),
  emotion("frustrated", "anger", "답답함", 44),
  emotion("lonely", "loneliness", "외로움", 51, "/image/emotions/confused.svg"),
  emotion("isolated", "loneliness", "소외감", 52),
  emotion("missing", "loneliness", "그리움", 53),
  emotion("void", "loneliness", "공허함", 54),
  emotion("tired", "fatigue", "피곤함", 61),
  emotion("lethargic", "fatigue", "무기력", 62),
  emotion("exhausted", "fatigue", "지침", 63),
  emotion("burnout", "fatigue", "번아웃", 64),
  emotion("ashamed", "reflection", "부끄러움", 71),
  emotion("guilty", "reflection", "죄책감", 72),
  emotion("regret", "reflection", "후회", 73),
  emotion("embarrassed", "reflection", "민망함", 74),
  emotion("confused", "confusion", "혼란", 81, "/image/emotions/confused.svg"),
  emotion("stuck", "confusion", "막막함", 82),
  emotion("sensitive", "confusion", "예민함", 83),
  emotion("blank", "confusion", "멍함", 84),
];

const emotionById = Object.fromEntries(EMOTIONS.map((emotion) => [emotion.id, emotion])) as Record<string, EmotionOption>;

export type EmotionId = (typeof EMOTIONS)[number]["id"];

export function getEmotionById(id: string) {
  return emotionById[id];
}

export function getEmotionGroupById(id: EmotionGroupId) {
  return groupById[id];
}

export function getEmotionColor(id: string, fallbackIndex = 0) {
  return getEmotionById(id)?.color ?? EMOTION_GROUPS[fallbackIndex % EMOTION_GROUPS.length].color;
}

export function getEmotionSoftColor(id: string, fallbackIndex = 0) {
  return getEmotionById(id)?.softColor ?? EMOTION_GROUPS[fallbackIndex % EMOTION_GROUPS.length].softColor;
}

export function getEmotionTextColor(id: string, fallbackIndex = 0) {
  return getEmotionById(id)?.textColor ?? EMOTION_GROUPS[fallbackIndex % EMOTION_GROUPS.length].textColor;
}

export function getEmotionCssVars(emotion: Pick<EmotionOption, "color" | "softColor" | "textColor">) {
  return {
    "--emotion-color": emotion.color,
    "--emotion-soft-color": emotion.softColor,
    "--emotion-text-color": emotion.textColor,
  } as CSSProperties;
}
