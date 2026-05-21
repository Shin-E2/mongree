"use server";

import {
  deleteImageFromS3,
  uploadImageServer,
} from "@/commons/utils/upload-images";
import {
  revalidateDiaryDeleted,
  revalidateDiaryUpdated,
  revalidateProfileComments,
  revalidateProfileUpdated,
} from "@/commons/utils/cache-revalidation";
import { getCurrentProfile } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";
import { FILE_CONSTRAINTS } from "@/commons/constants/validation";

export interface ProfileCommentItem {
  id: string;
  content: string;
  createdAt: string;
  diaryId: string;
  diaryTitle: string;
  isReply: boolean;
}

export interface ProfileDiaryItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isPrivate: boolean;
}

export interface ProfilePageData {
  profile: {
    id: string;
    nickname: string;
    profileImage: string | null;
    createdAt: string | null;
  } | null;
  summary: {
    diaryCount: number;
    commentCount: number;
    publicDiaryCount: number;
    privateDiaryCount: number;
  };
  comments: ProfileCommentItem[];
  diaries: ProfileDiaryItem[];
}

interface ProfileCommentRow {
  id: string;
  content: string;
  created_at: string | null;
  diary_id: string;
  parent_id: string | null;
  diaries: {
    id: string;
    title: string;
    deleted_at: string | null;
  } | null;
}

interface ProfileDiaryRow {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  is_private: boolean;
}

export type ProfileDiaryDeleteScope = "private" | "public" | "all";

const PROFILE_IMAGE_MAX_SIZE = FILE_CONSTRAINTS.PROFILE_IMAGE_MAX_BYTES;
const PROFILE_IMAGE_ALLOWED_TYPES = FILE_CONSTRAINTS.PROFILE_ALLOWED_TYPES;

function isValidImageFile(file: File | string | null): file is File {
  return file instanceof File && file.size > 0;
}

async function deletePreviousProfileImage(imageUrl: string | null) {
  if (!imageUrl || !imageUrl.includes(".amazonaws.com/")) return;

  try {
    await deleteImageFromS3(imageUrl);
  } catch (error) {
    console.error("기존 프로필 이미지 삭제 실패:", error);
  }
}

export async function getProfilePageData(): Promise<ProfilePageData> {
  const emptyData: ProfilePageData = {
    profile: null,
    summary: {
      diaryCount: 0,
      commentCount: 0,
      publicDiaryCount: 0,
      privateDiaryCount: 0,
    },
    comments: [],
    diaries: [],
  };

  const user = await getCurrentProfile();
  if (!user) return emptyData;

  const supabase = await createClient();
  const [
    { count: diaryCount },
    { count: publicDiaryCount },
    { count: commentCount },
    { data: comments, error: commentsError },
    { data: diaries, error: diariesError },
  ] = await Promise.all([
    supabase
      .from("diaries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null),
    supabase
      .from("diaries")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_private", false)
      .is("deleted_at", null),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .is("deleted_at", null),
    supabase
      .from("comments")
      .select(
        `
        id,
        content,
        created_at,
        diary_id,
        parent_id,
        diaries (
          id,
          title,
          deleted_at
        )
        `
      )
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(30)
      .returns<ProfileCommentRow[]>(),
    supabase
      .from("diaries")
      .select("id, title, content, created_at, is_private")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false })
      .limit(60)
      .returns<ProfileDiaryRow[]>(),
  ]);

  if (commentsError) console.error("프로필 댓글 조회 실패:", commentsError);
  if (diariesError) console.error("프로필 일기 조회 실패:", diariesError);

  return {
    profile: {
      id: user.id,
      nickname: user.nickname,
      profileImage: user.profile_image,
      createdAt: user.created_at,
    },
    summary: {
      diaryCount: diaryCount ?? 0,
      commentCount: commentCount ?? 0,
      publicDiaryCount: publicDiaryCount ?? 0,
      privateDiaryCount: Math.max(
        0,
        (diaryCount ?? 0) - (publicDiaryCount ?? 0)
      ),
    },
    comments: (comments ?? [])
      .filter((comment) => comment.diaries?.deleted_at === null)
      .map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.created_at ?? new Date().toISOString(),
        diaryId: comment.diary_id,
        diaryTitle: comment.diaries?.title ?? "삭제된 일기",
        isReply: Boolean(comment.parent_id),
      })),
    diaries: (diaries ?? []).map((diary) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      createdAt: diary.created_at ?? new Date().toISOString(),
      isPrivate: diary.is_private,
    })),
  };
}

export async function updateProfile(formData: FormData) {
  const user = await getCurrentProfile();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const nickname = formData.get("nickname")?.toString().trim() ?? "";
  const profileImageFile = formData.get("profileImage");

  if (nickname.length < 2) {
    return { success: false, error: "닉네임은 2글자 이상 입력해주세요." };
  }

  if (nickname.length > 20) {
    return { success: false, error: "닉네임은 최대 20자까지 입력 가능합니다." };
  }

  const supabase = await createClient();
  const { data: duplicatedNickname } = await supabase
    .from("profiles")
    .select("id")
    .eq("nickname", nickname)
    .neq("id", user.id)
    .maybeSingle();

  if (duplicatedNickname) {
    return { success: false, error: "이미 사용 중인 닉네임입니다." };
  }

  let nextProfileImage = user.profile_image;

  try {
    if (isValidImageFile(profileImageFile)) {
      nextProfileImage = await uploadImageServer(profileImageFile, {
        maxSize: PROFILE_IMAGE_MAX_SIZE,
        allowedTypes: PROFILE_IMAGE_ALLOWED_TYPES,
      });
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        nickname,
        profile_image: nextProfileImage,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw new Error(error.message);

    if (nextProfileImage !== user.profile_image) {
      await deletePreviousProfileImage(user.profile_image);
    }

    revalidateProfileUpdated(user.id);
    return { success: true };
  } catch (error) {
    if (nextProfileImage && nextProfileImage !== user.profile_image) {
      await deletePreviousProfileImage(nextProfileImage);
    }

    const message =
      error instanceof Error ? error.message : "프로필 수정에 실패했습니다.";
    return { success: false, error: message };
  }
}

export async function deleteProfileComment(commentId: string) {
  const user = await getCurrentProfile();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  const { data: comment } = await supabase
    .from("comments")
    .select("diary_id")
    .eq("id", commentId)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  const { error } = await supabase
    .from("comments")
    .update({
      deleted_at: new Date().toISOString(),
      content: "삭제된 댓글입니다.",
      updated_at: new Date().toISOString(),
    })
    .eq("id", commentId)
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (error) {
    console.error("프로필 댓글 삭제 실패:", error);
    return { success: false, error: "댓글 삭제에 실패했습니다." };
  }

  revalidateProfileComments(comment?.diary_id ? [comment.diary_id] : []);
  return { success: true };
}

export async function deleteAllProfileComments() {
  const user = await getCurrentProfile();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("diary_id")
    .eq("user_id", user.id)
    .is("deleted_at", null);

  const { error } = await supabase
    .from("comments")
    .update({
      deleted_at: new Date().toISOString(),
      content: "삭제된 댓글입니다.",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (error) {
    console.error("프로필 댓글 전체 삭제 실패:", error);
    return { success: false, error: "댓글 전체 삭제에 실패했습니다." };
  }

  const diaryIds = [
    ...new Set((comments ?? []).map((comment) => comment.diary_id)),
  ];
  revalidateProfileComments(diaryIds);
  return { success: true };
}

export async function deleteProfileDiaries(scope: ProfileDiaryDeleteScope) {
  const user = await getCurrentProfile();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  let selectQuery = supabase
    .from("diaries")
    .select("id, is_private")
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (scope === "private") selectQuery = selectQuery.eq("is_private", true);
  if (scope === "public") selectQuery = selectQuery.eq("is_private", false);

  const { data: diaries, error: selectError } = await selectQuery;
  if (selectError) {
    console.error("프로필 일기 삭제 대상 조회 실패:", selectError);
    return { success: false, error: "삭제할 일기를 불러오지 못했습니다." };
  }

  if (!diaries || diaries.length === 0) {
    return { success: false, error: "삭제할 일기가 없습니다." };
  }

  let updateQuery = supabase
    .from("diaries")
    .update({ deleted_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .is("deleted_at", null);

  if (scope === "private") updateQuery = updateQuery.eq("is_private", true);
  if (scope === "public") updateQuery = updateQuery.eq("is_private", false);

  const { error } = await updateQuery;
  if (error) {
    console.error("프로필 일기 삭제 실패:", error);
    return { success: false, error: "일기 삭제에 실패했습니다." };
  }

  diaries.forEach((diary) => {
    revalidateDiaryDeleted({
      userId: user.id,
      diaryId: diary.id,
      wasPrivate: Boolean(diary.is_private),
    });
  });
  revalidateProfileUpdated(user.id);
  return { success: true, count: diaries.length };
}

export async function makePublicDiariesPrivate() {
  const user = await getCurrentProfile();
  if (!user) return { success: false, error: "로그인이 필요합니다." };

  const supabase = await createClient();
  const { data: diaries, error: selectError } = await supabase
    .from("diaries")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_private", false)
    .is("deleted_at", null);

  if (selectError) {
    console.error("공개 일기 조회 실패:", selectError);
    return { success: false, error: "공개 일기를 불러오지 못했습니다." };
  }

  if (!diaries || diaries.length === 0) {
    return { success: false, error: "전환할 공개 일기가 없습니다." };
  }

  const { error } = await supabase
    .from("diaries")
    .update({ is_private: true, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("is_private", false)
    .is("deleted_at", null);

  if (error) {
    console.error("공개 일기 비공개 전환 실패:", error);
    return { success: false, error: "공개 일기를 비공개로 바꾸지 못했습니다." };
  }

  diaries.forEach((diary) => {
    revalidateDiaryUpdated({
      userId: user.id,
      diaryId: diary.id,
      isPrivate: true,
      wasPrivate: false,
    });
  });
  revalidateProfileUpdated(user.id);
  return { success: true, count: diaries.length };
}
