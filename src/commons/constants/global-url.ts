export const URL = () => ({
  // 로그인
  LOGIN: `/login`,

  // 회원가입
  SIGNUP: `/signup`,

  // 메인 페이지
  HOME: `/home`,

  // 일기 작성
  DIARY_NEW: `/diary/new`,

  // 일기 상세보기
  DIARY_DETAIL: (id: string) => `/diary/${id}`,

  // 일기 목록
  DIARY: `/diary`,

  // 마이 페이지
  PROFILE: `/profile`,

  // 몽이 꾸미기
  MONGI: `/mongi`,

  CALENDAR: `/calendar`,

  STATISTICS: `/statistics`,

  COMMUNITY: `/community`,

  AI_REPORT: `/ai-report`,

  COUNSELORS: `/counselors`,

  RESET_PASSWORD: `/reset-password`,
});
