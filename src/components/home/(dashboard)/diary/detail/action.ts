"use server";

import { createClient } from "@/lib/supabase-server";
import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteDiary(diaryId: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "로그인이 필요합니다." };
    const supabase = await createClient();

    const { data: diary, error: findError } = await supabase
      .from("diaries")
      .select("user_id")
      .eq("id", diaryId)
      .single();

    if (findError || !diary || diary.user_id !== user.id) {
      console.error("Error finding diary or unauthorized:", findError);
      return { error: "You do not have permission to delete this diary." };
    }

    const { error: deleteError } = await supabase
      .from("diaries")
      .delete()
      .eq("id", diaryId);

    if (deleteError) {
      console.error("Error deleting diary:", deleteError);
      return { error: "Failed to delete diary." };
    }

    revalidateTag(`diary-${diaryId}`);
    redirect("/diary");
  } catch (error) {
    console.error("Unexpected error in deleteDiary:", error);
    return { error: "Failed to delete diary." };
  }
}

export async function toggleEmpathy(diaryId: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "로그인이 필요합니다." };
    const supabase = await createClient();

    const { data: existingEmpathy, error: findEmpathyError } = await supabase
      .from("diary_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("diary_id", diaryId)
      .maybeSingle();

    if (findEmpathyError) {
      console.error("Error finding empathy:", findEmpathyError);
      return { error: "Failed to check empathy." };
    }

    if (existingEmpathy) {
      const { error: deleteEmpathyError } = await supabase
        .from("diary_likes")
        .delete()
        .eq("id", existingEmpathy.id);

      if (deleteEmpathyError) {
        console.error("Error deleting empathy:", deleteEmpathyError);
        return { error: "Failed to remove empathy." };
      }
    } else {
      const { error: createEmpathyError } = await supabase
        .from("diary_likes")
        .insert({ user_id: user.id, diary_id: diaryId });

      if (createEmpathyError) {
        console.error("Error creating empathy:", createEmpathyError);
        return { error: "Failed to add empathy." };
      }
    }

    revalidateTag(`diary-empathies-${diaryId}`);

    const { data: updatedEmpathies, error: fetchEmpathiesError } =
      await supabase
        .from("diary_likes")
        .select(
          `
          *,
          profiles (
            id,
            nickname,
            profile_image
          )
          `
        )
        .eq("diary_id", diaryId)
        .order("created_at", { ascending: false })
        .limit(3);

    if (fetchEmpathiesError) {
      console.error("Error fetching updated empathies:", fetchEmpathiesError);
      return { error: "Failed to load empathies." };
    }

    return {
      success: true,
      empathies: updatedEmpathies?.map((empathy: any) => ({
        ...empathy,
        user: empathy.profiles,
      })),
      isEmpathized: !existingEmpathy,
    };
  } catch (error) {
    console.error("Unexpected error in toggleEmpathy:", error);
    return { error: "Failed to update empathy." };
  }
}

export async function getCommentCount(diaryId: string) {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("diary_id", diaryId);

    if (error) {
      console.error("Error counting comments:", error);
      return 0;
    }

    return count ?? 0;
  } catch (error) {
    console.error("Unexpected error in getCommentCount:", error);
    return 0;
  }
}
