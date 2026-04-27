"use server";

import { createClient } from "@/lib/supabase-server";
import type {
  GetPublicDiariesParams,
  PublicDiary,
  PublicDiaryResponse,
} from "./types";

const ITEMS_PER_PAGE = 12;

interface PublicDiaryRow {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  updated_at: string | null;
  is_private: boolean | null;
  user_id: string;
  profiles: {
    id: string;
    nickname: string;
    profile_image: string | null;
  } | null;
  diary_emotions:
    | {
        diary_id: string;
        emotion_id: string;
        emotions: {
          id: string;
          label: string;
          image: string | null;
        } | null;
      }[]
    | null;
  diary_images:
    | {
        id: string;
        diary_id: string;
        image_url: string;
        sort_order: number;
      }[]
    | null;
  diary_tags:
    | {
        diary_id: string;
        tag_id: string;
        tags: {
          id: string;
          name: string;
        } | null;
      }[]
    | null;
  diary_likes:
    | {
        id: string;
        created_at: string | null;
        profiles: {
          id: string;
          nickname: string;
          profile_image: string | null;
        } | null;
      }[]
    | null;
  comments: { id: string; deleted_at: string | null }[] | null;
}

export async function getPublicDiaries({
  page,
  searchTerm,
  emotions,
  sortBy = "latest",
}: GetPublicDiariesParams): Promise<PublicDiaryResponse> {
  try {
    const supabase = await createClient();
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const keyword = searchTerm?.trim();

    let query = supabase
      .from("diaries")
      .select(
        `
        id,
        title,
        content,
        created_at,
        updated_at,
        is_private,
        user_id,
        profiles (
          id,
          nickname,
          profile_image
        ),
        diary_emotions (
          diary_id,
          emotion_id,
          emotions (
            id,
            label,
            image
          )
        ),
        diary_images (
          id,
          diary_id,
          image_url,
          sort_order
        ),
        diary_tags (
          diary_id,
          tag_id,
          tags (
            id,
            name
          )
        ),
        diary_likes (
          id,
          created_at,
          profiles (
            id,
            nickname,
            profile_image
          )
        ),
        comments (
          id,
          deleted_at
        )
        `,
        { count: "exact" }
      )
      .eq("is_private", false)
      .is("deleted_at", null);

    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,content.ilike.%${keyword}%`);
    }

    if (emotions?.length) {
      query = query.in("diary_emotions.emotion_id", emotions);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error, count } = await query.returns<PublicDiaryRow[]>();

    if (error) {
      console.error("Supabase public diary list error:", error);
      return {
        success: false,
        diaries: [],
        hasMore: false,
        total: 0,
        error: error.message,
      };
    }

    const rows = (data ?? []) as PublicDiaryRow[];
    const formattedDiaries: PublicDiary[] = rows.map((diary) => ({
      id: diary.id,
      title: diary.title,
      content: diary.content,
      createdAt: diary.created_at ? new Date(diary.created_at) : new Date(),
      updatedAt: diary.updated_at ? new Date(diary.updated_at) : new Date(),
      isPrivate: diary.is_private ?? false,
      userId: diary.user_id,
      user: diary.profiles,
      diaryEmotion:
        diary.diary_emotions
          ?.map((item) => ({
            emotion: item.emotions,
            diaryId: item.diary_id,
            emotionId: item.emotion_id,
          }))
          .filter(
            (
              item
            ): item is {
              emotion: { id: string; label: string; image: string | null };
              diaryId: string;
              emotionId: string;
            } => Boolean(item.emotion)
          ) ?? [],
      images:
        diary.diary_images
          ?.sort((a, b) => a.sort_order - b.sort_order)
          .map((image) => ({
            id: image.id,
            image_url: image.image_url,
            sort_order: image.sort_order,
            diary_id: image.diary_id,
          })) ?? [],
      tags:
        diary.diary_tags
          ?.map((item) => ({
            tag: item.tags,
            diaryId: item.diary_id,
            tagId: item.tag_id,
          }))
          .filter(
            (
              item
            ): item is {
              tag: { id: string; name: string };
              diaryId: string;
              tagId: string;
            } => Boolean(item.tag)
          ) ?? [],
      empathies:
        diary.diary_likes?.map((like) => ({
          id: like.id,
          createdAt: like.created_at ? new Date(like.created_at) : new Date(),
          user: like.profiles,
        })) ?? [],
      _count: {
        empathies: diary.diary_likes?.length ?? 0,
        comments:
          diary.comments?.filter((comment) => comment.deleted_at === null)
            .length ?? 0,
      },
    }));

    const sortedDiaries =
      sortBy === "popular"
        ? [...formattedDiaries].sort((a, b) => {
            const likeGap =
              (b._count?.empathies ?? 0) - (a._count?.empathies ?? 0);
            if (likeGap !== 0) return likeGap;
            return b.createdAt.getTime() - a.createdAt.getTime();
          })
        : formattedDiaries;
    const paginatedDiaries = sortedDiaries.slice(skip, skip + ITEMS_PER_PAGE);
    const total = count ?? sortedDiaries.length;

    return {
      success: true,
      diaries: paginatedDiaries,
      hasMore: skip + ITEMS_PER_PAGE < total,
      total,
    };
  } catch (error) {
    console.error("getPublicDiaries error:", error);
    return {
      success: false,
      diaries: [],
      hasMore: false,
      total: 0,
      error: "Failed to load public diaries.",
    };
  }
}
