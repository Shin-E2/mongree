interface IURL {
  id?: string;
}

export const URL = ({ id }: IURL) => ({
  // 로그인
  LOGIN: `/login`,

  // 회원가입
  SIGNUP: `/signup`,

  // 메인 페이지
  HOME: `/home`,

  // 일기 작성
  DIARY: `/diary`,
  // 일기 상세보기
  DIARY_DETAIL: `/diary/${id}`,

  // 마이 페이지
  PROFILE: `/profile`,

  CALENDAR: `/calendar`,

  STATISTICS: `/statistics`,

  COMMUNITY: `/community`,

  COUNSELORS: `/counselors`,
});
