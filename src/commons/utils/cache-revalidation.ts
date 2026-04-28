import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_PATHS = {
  home: "/home",
  diary: "/diary",
  community: "/community",
  calendar: "/calendar",
  statistics: "/statistics",
  aiReport: "/ai-report",
  profile: "/profile",
  diaryDetail: (diaryId: string) => `/diary/${diaryId}`,
};

export const CACHE_TAGS = {
  home: "home-dashboard",
  publicDiaries: "public-diaries",
  publicDiary: (diaryId: string) => `public-diary-${diaryId}`,
  diary: (diaryId: string) => `diary-${diaryId}`,
  diaryEmpathies: (diaryId: string) => `diary-empathies-${diaryId}`,
  diaryComments: (diaryId: string) => `diary-comments-${diaryId}`,
  comment: (commentId: string) => `comment-${commentId}`,
  commentReplies: (commentId: string) => `comment-replies-${commentId}`,
  userProfile: (userId: string) => `user-profile-${userId}`,
  userDiaries: (userId: string) => `user-diaries-${userId}`,
  userCalendar: (userId: string) => `user-calendar-${userId}`,
  userStatistics: (userId: string) => `user-statistics-${userId}`,
  userAiReport: (userId: string) => `user-ai-report-${userId}`,
};

function revalidateUniquePaths(paths: string[]) {
  [...new Set(paths)].forEach((path) => revalidatePath(path));
}

function revalidateUniqueTags(tags: string[]) {
  [...new Set(tags)].forEach((tag) => revalidateTag(tag));
}

function revalidateUserDiarySummaries(userId: string) {
  revalidateUniquePaths([
    CACHE_PATHS.home,
    CACHE_PATHS.diary,
    CACHE_PATHS.calendar,
    CACHE_PATHS.statistics,
    CACHE_PATHS.aiReport,
  ]);

  // 개인 데이터는 사용자별 태그로만 갱신
  revalidateUniqueTags([
    CACHE_TAGS.home,
    CACHE_TAGS.userDiaries(userId),
    CACHE_TAGS.userCalendar(userId),
    CACHE_TAGS.userStatistics(userId),
    CACHE_TAGS.userAiReport(userId),
  ]);
}

function revalidatePublicDiarySurfaces(diaryId: string) {
  revalidateUniquePaths([CACHE_PATHS.community, CACHE_PATHS.home]);
  revalidateUniqueTags([
    CACHE_TAGS.publicDiaries,
    CACHE_TAGS.publicDiary(diaryId),
  ]);
}

export function revalidateDiaryCreated(params: {
  userId: string;
  diaryId: string;
  isPrivate: boolean;
}) {
  revalidateUserDiarySummaries(params.userId);
  revalidateUniqueTags([CACHE_TAGS.diary(params.diaryId)]);

  if (!params.isPrivate) {
    revalidatePublicDiarySurfaces(params.diaryId);
  }
}

export function revalidateDiaryUpdated(params: {
  userId: string;
  diaryId: string;
  isPrivate: boolean;
  wasPrivate?: boolean;
}) {
  revalidateUserDiarySummaries(params.userId);
  revalidateUniquePaths([CACHE_PATHS.diaryDetail(params.diaryId)]);
  revalidateUniqueTags([CACHE_TAGS.diary(params.diaryId)]);

  if (!params.isPrivate || params.wasPrivate === false) {
    revalidatePublicDiarySurfaces(params.diaryId);
  }
}

export function revalidateDiaryDeleted(params: {
  userId: string;
  diaryId: string;
  wasPrivate: boolean;
}) {
  revalidateUserDiarySummaries(params.userId);
  revalidateUniquePaths([CACHE_PATHS.diaryDetail(params.diaryId)]);
  revalidateUniqueTags([
    CACHE_TAGS.diary(params.diaryId),
    CACHE_TAGS.diaryComments(params.diaryId),
    CACHE_TAGS.diaryEmpathies(params.diaryId),
  ]);

  if (!params.wasPrivate) {
    revalidatePublicDiarySurfaces(params.diaryId);
  }
}

export function revalidateDiaryComments(
  diaryId: string,
  parentId?: string | null
) {
  revalidateUniquePaths([
    CACHE_PATHS.diaryDetail(diaryId),
    CACHE_PATHS.community,
    CACHE_PATHS.home,
  ]);

  revalidateUniqueTags([
    CACHE_TAGS.diary(diaryId),
    CACHE_TAGS.diaryComments(diaryId),
    CACHE_TAGS.publicDiary(diaryId),
    CACHE_TAGS.publicDiaries,
    ...(parentId ? [CACHE_TAGS.commentReplies(parentId)] : []),
  ]);
}

export function revalidateCommentLike(params: {
  diaryId: string;
  commentId: string;
}) {
  revalidateUniquePaths([CACHE_PATHS.diaryDetail(params.diaryId)]);
  revalidateUniqueTags([
    CACHE_TAGS.comment(params.commentId),
    CACHE_TAGS.diaryComments(params.diaryId),
  ]);
}

export function revalidateDiaryEmpathy(diaryId: string) {
  revalidateUniquePaths([
    CACHE_PATHS.diaryDetail(diaryId),
    CACHE_PATHS.community,
    CACHE_PATHS.home,
  ]);

  revalidateUniqueTags([
    CACHE_TAGS.diary(diaryId),
    CACHE_TAGS.diaryEmpathies(diaryId),
    CACHE_TAGS.publicDiary(diaryId),
    CACHE_TAGS.publicDiaries,
  ]);
}

export function revalidateProfileUpdated(userId: string) {
  revalidateUniquePaths([
    CACHE_PATHS.profile,
    CACHE_PATHS.home,
    CACHE_PATHS.diary,
    CACHE_PATHS.community,
  ]);

  revalidateUniqueTags([
    CACHE_TAGS.userProfile(userId),
    CACHE_TAGS.userDiaries(userId),
    CACHE_TAGS.publicDiaries,
    CACHE_TAGS.home,
  ]);
}

export function revalidateProfileComments(diaryIds: string[]) {
  revalidateUniquePaths([
    CACHE_PATHS.profile,
    CACHE_PATHS.home,
    CACHE_PATHS.community,
    ...diaryIds.map((diaryId) => CACHE_PATHS.diaryDetail(diaryId)),
  ]);

  revalidateUniqueTags([
    CACHE_TAGS.publicDiaries,
    ...diaryIds.flatMap((diaryId) => [
      CACHE_TAGS.diary(diaryId),
      CACHE_TAGS.diaryComments(diaryId),
      CACHE_TAGS.publicDiary(diaryId),
    ]),
  ]);
}
