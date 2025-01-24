import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
  id?: string; //로그인한 사용자만 가지고 있음
}

// 섹션 객체 생성
export async function getSession() {
  // console.log("쿠키:", cookies());

  return getIronSession<SessionContent>(await cookies(), {
    cookieName: "mongree",
    password: process.env.COOKIE_PASSWORD!,
  });
}
