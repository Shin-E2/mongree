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

  // 공개일기 상세보기
  COMMUNITY_DIARY_DETAIL: (id: string) => `/community/diary/${id}`,

  // 일기 목록
  DIARY: `/diary`,

  // 마이 페이지
  PROFILE: `/profile`,

  CALENDAR: `/calendar`,

  STATISTICS: `/statistics`,

  COMMUNITY: `/community`,

  COUNSELORS: `/counselors`,
});
