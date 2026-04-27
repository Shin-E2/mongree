"use server";

import { getUser } from "@/lib/get-user";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function togglePublicEmpathy(diaryId: string) {
  try {
    const user = await getUser();
    if (!user) return { error: "로그인이 필요합니다." };
    const supabase = await createClient();

    const { data: existingEmpathy, error: checkError } = await supabase
      .from("diary_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("diary_id", diaryId)
      .maybeSingle();

    if (checkError) {
      console.error("Supabase public empathy check error:", checkError);
      throw new Error(checkError.message);
    }

    if (existingEmpathy) {
      const { error: deleteError } = await supabase
        .from("diary_likes")
        .delete()
        .eq("id", existingEmpathy.id);

      if (deleteError) {
        console.error("Supabase public empathy delete error:", deleteError);
        throw new Error(deleteError.message);
      }
    } else {
      const { error: createError } = await supabase
        .from("diary_likes")
        .insert([{ user_id: user.id, diary_id: diaryId }]);

      if (createError) {
        console.error("Supabase public empathy create error:", createError);
        throw new Error(createError.message);
      }
    }

    revalidateTag(`public-diary-${diaryId}`);
    revalidateTag("public-diaries");

    const { data: updatedEmpathies, error: fetchEmpathiesError } =
      await supabase
        .from("diary_likes")
        .select(
          `
          id,
          created_at,
          profiles (
            id,
            user_id,
            profile_image
          )
          `
        )
        .eq("diary_id", diaryId)
        .order("created_at", { ascending: false })
        .limit(3);

    const { count: empathyCount, error: countError } = await supabase
      .from("diary_likes")
      .select("id", { count: "exact", head: true })
      .eq("diary_id", diaryId);

    if (fetchEmpathiesError) {
      console.error("Supabase public empathy list error:", fetchEmpathiesError);
    }

    if (countError) {
      console.error("Supabase public empathy count error:", countError);
    }

    const formattedEmpathies =
      updatedEmpathies?.map((empathy: any) => ({
        id: empathy.id,
        createdAt: empathy.created_at
          ? new Date(empathy.created_at)
          : new Date(),
        user: empathy.profiles,
      })) ?? [];

    return {
      success: true,
      empathies: formattedEmpathies,
      count: empathyCount ?? 0,
      isEmpathized: !existingEmpathy,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to update empathy.",
    };
  }
}
