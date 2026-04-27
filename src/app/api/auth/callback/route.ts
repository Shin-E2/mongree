import { createClient } from "@/lib/supabase-server";
import { login } from "@/lib/login";
import { NextResponse, type NextRequest } from "next/server";

// 소셜 로그인 후 OAuth 제공자가 여기로 리다이렉트
// code를 세션으로 교환하고 iron-session에 저장
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await login(data.user.id);
      return NextResponse.redirect(`${origin}/home`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`);
}
