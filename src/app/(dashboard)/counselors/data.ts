export type Counselor = {
  id: string;
  name: string;
  title: string;
  summary: string;
  specialties: string[];
  approach: string;
  availableTimes: string[];
  sessionTypes: string[];
  experience: string;
  nextSlot: string;
};

export const counselors: Counselor[] = [
  {
    id: "mind-care",
    name: "김서연",
    title: "감정 조절 전문 상담사",
    summary: "불안, 번아웃, 대인관계 스트레스를 차분하게 정리하도록 돕습니다.",
    specialties: ["불안", "번아웃", "관계 스트레스"],
    approach:
      "최근 일기 흐름과 현재 감정 강도를 함께 살펴보고, 바로 실행 가능한 회복 루틴을 설계합니다.",
    availableTimes: ["월 19:00", "수 20:00", "토 11:00"],
    sessionTypes: ["화상 상담", "채팅 상담"],
    experience: "상담 경력 8년",
    nextSlot: "오늘 20:00",
  },
  {
    id: "daily-balance",
    name: "박지훈",
    title: "생활 리듬 회복 코치",
    summary: "수면, 학업, 업무 루틴이 무너진 사용자를 위한 구조화 상담을 제공합니다.",
    specialties: ["수면", "루틴 회복", "자기관리"],
    approach:
      "하루의 반복 패턴을 작게 나누어 부담 없는 행동 계획과 점검 주기를 만듭니다.",
    availableTimes: ["화 18:30", "목 21:00", "일 10:00"],
    sessionTypes: ["화상 상담", "전화 상담"],
    experience: "상담 경력 6년",
    nextSlot: "내일 18:30",
  },
  {
    id: "relationship-space",
    name: "이하린",
    title: "관계 회복 상담사",
    summary: "가족, 친구, 연인 사이에서 반복되는 감정 소모를 함께 다룹니다.",
    specialties: ["관계 갈등", "자존감", "소통"],
    approach:
      "감정 기록에 남은 말과 사건을 바탕으로 경계 설정과 대화 전략을 구체화합니다.",
    availableTimes: ["월 21:00", "금 19:30", "토 15:00"],
    sessionTypes: ["화상 상담", "채팅 상담"],
    experience: "상담 경력 9년",
    nextSlot: "금요일 19:30",
  },
];

export const getCounselor = (id: string) =>
  counselors.find((counselor) => counselor.id === id);
