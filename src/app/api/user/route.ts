import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  console.log("사용자 정보:", request);
  return Response.json({
    ok: true,
  });
}

export async function POST(request: NextRequest) {
  const data = await request.json(); // cookies 확인
  console.log("로그인 했습니다");

  return Response.json(data);
}
