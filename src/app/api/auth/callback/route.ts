import { createClient } from "@/lib/supabase-server";
import { NextResponse, type NextRequest } from "next/server";

function getStringMetadataValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : null;
}

function getSocialProfileImage(metadata: Record<string, unknown>) {
  const kakaoAccount = metadata.kakao_account as
    | { profile?: Record<string, unknown> }
    | undefined;
  const kakaoProperties = metadata.properties as Record<string, unknown> | undefined;

  return (
    getStringMetadataValue(metadata.avatar_url) ??
    getStringMetadataValue(metadata.picture) ??
    getStringMetadataValue(metadata.profile_image) ??
    getStringMetadataValue(metadata.profile_image_url) ??
    getStringMetadataValue(kakaoAccount?.profile?.profile_image_url) ??
    getStringMetadataValue(kakaoAccount?.profile?.thumbnail_image_url) ??
    getStringMetadataValue(kakaoProperties?.profile_image) ??
    getStringMetadataValue(kakaoProperties?.thumbnail_image)
  );
}

async function syncSocialProfileImage(
  supabase: Awaited<ReturnType<typeof createClient>>
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const profileImage = getSocialProfileImage(user.user_metadata ?? {});
  if (!profileImage) return;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("profile_image")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.profile_image) return;

  // 소셜 로그인 프로필 이미지가 있으면 최초 로그인 시 저장
  await supabase
    .from("profiles")
    .update({ profile_image: profileImage })
    .eq("id", user.id);
}

// 소셜 로그인 제공자가 여기로 리다이렉트
// @supabase/ssr이 세션 쿠키를 저장하므로 별도 세션 저장 불필요
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      await syncSocialProfileImage(supabase);
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
