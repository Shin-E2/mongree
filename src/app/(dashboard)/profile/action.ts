"use server";

import {
  deleteImageFromS3,
  uploadImageServer,
} from "@/commons/utils/upload-images";
import {
  revalidateProfileComments,
  revalidateProfileUpdated,
} from "@/commons/utils/cache-revalidation";
import { getUser } from "@/lib/get-user";
import { createClient } from "@/lib/supabase-server";

export interface ProfileCommentItem {
  id: string;
  content: string;
  createdAt: string;
  diaryId: string;
  diaryTitle: string;
  isReply: boolean;
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
  };
  comments: ProfileCommentItem[];
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

const PROFILE_IMAGE_MAX_SIZE = 3 * 1024 * 1024;
const PROFILE_IMAGE_ALLOWED_TYPES = ["image/jpeg", "image/png"];

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
    },
    comments: [],
  };

  const user = await getUser();
  if (!user) return emptyData;

  const supabase = await createClient();
  const [
    { count: diaryCount },
    { count: publicDiaryCount },
    { count: commentCount },
    { data: comments, error: commentsError },
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
  ]);

  if (commentsError) {
    console.error("프로필 댓글 조회 오류:", commentsError);
  }

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
  };
}

export async function updateProfile(formData: FormData) {
  const user = await getUser();
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

    if (error) {
      throw new Error(error.message);
    }

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
  const user = await getUser();
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
    console.error("프로필 댓글 삭제 오류:", error);
    return { success: false, error: "댓글 삭제에 실패했습니다." };
  }

  revalidateProfileComments(comment?.diary_id ? [comment.diary_id] : []);
  return { success: true };
}

export async function deleteAllProfileComments() {
  const user = await getUser();
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
    console.error("프로필 댓글 전체 삭제 오류:", error);
    return { success: false, error: "댓글 전체 삭제에 실패했습니다." };
  }

  const diaryIds = [
    ...new Set((comments ?? []).map((comment) => comment.diary_id)),
  ];
  revalidateProfileComments(diaryIds);
  return { success: true };
}
