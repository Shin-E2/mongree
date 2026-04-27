import { createClient } from "@/lib/supabase-server";
import { NextResponse, type NextRequest } from "next/server";

// 소셜 로그인 후 OAuth 제공자가 여기로 리다이렉트
// @supabase/ssr이 세션 쿠키를 자동 저장하므로 별도 iron-session 불필요
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
