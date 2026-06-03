// 감정 카테고리별 색상 (감정 분포, 통계 차트 등에서 공용 사용).
// 감정은 9개 카테고리로 묶이며, 카테고리마다 하나의 soft OKLCH 색을 부여한다.
// Mongree 톤에 맞춰 채도를 낮춘 파스텔 계열로 통일.

export type EmotionCategory =
  | "joy"
  | "calm"
  | "sad"
  | "anxious"
  | "angry"
  | "lonely"
  | "tired"
  | "shame"
  | "confused";

// 카테고리 → 막대 색 (oklch, soft)
const CATEGORY_COLOR: Record<EmotionCategory, string> = {
  joy: "oklch(0.82 0.13 85)", // 따뜻한 노랑
  calm: "oklch(0.78 0.09 165)", // 민트
  sad: "oklch(0.72 0.11 250)", // 차분한 파랑
  anxious: "oklch(0.71 0.1 300)", // 연보라
  angry: "oklch(0.7 0.14 25)", // 코랄 레드
  lonely: "oklch(0.66 0.07 265)", // 청회색
  tired: "oklch(0.7 0.06 70)", // 세피아
  shame: "oklch(0.78 0.1 12)", // 로즈
  confused: "oklch(0.74 0.08 195)", // 틸
};

const DEFAULT_COLOR = "oklch(0.7 0.04 255)";

// 감정 id → 카테고리
const EMOTION_CATEGORY: Record<string, EmotionCategory> = {
  // 기쁨 계열
  joyful: "joy",
  happy: "joy",
  excited: "joy",
  proud: "joy",
  // 평온 계열 (실망은 부정이지만 강도가 약해 평온 톤으로 처리)
  disappointed: "calm",
  calm: "calm",
  relieved: "calm",
  comfortable: "calm",
  stable: "calm",
  // 슬픔 계열
  sad: "sad",
  hurt: "sad",
  loss: "sad",
  empty: "sad",
  // 불안 계열
  anxious: "anxious",
  worried: "anxious",
  nervous: "anxious",
  scared: "anxious",
  // 분노 계열
  angry: "angry",
  irritated: "angry",
  unfair: "angry",
  frustrated: "angry",
  // 외로움 계열
  lonely: "lonely",
  isolated: "lonely",
  missing: "lonely",
  void: "lonely",
  // 피곤 계열
  tired: "tired",
  lethargic: "tired",
  exhausted: "tired",
  burnout: "tired",
  // 부끄러움 계열
  ashamed: "shame",
  guilty: "shame",
  regret: "shame",
  embarrassed: "shame",
  // 혼란 계열
  confused: "confused",
  stuck: "confused",
  sensitive: "confused",
  blank: "confused",
};

export function getEmotionCategory(emotionId: string): EmotionCategory | null {
  return EMOTION_CATEGORY[emotionId] ?? null;
}

// 감정 막대 색 (알 수 없는 id는 중립색)
export function getEmotionColor(emotionId: string): string {
  const category = EMOTION_CATEGORY[emotionId];
  return category ? CATEGORY_COLOR[category] : DEFAULT_COLOR;
}
