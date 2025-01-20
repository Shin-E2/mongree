"use server";

import db from "@/lib/db";

// 닉네임 중복 검사
export const checkNickname = async (nickname: string) => {
  console.log("Checking nickname:", nickname); // 값이 제대로 전달되는지 확인

  const user = await db.user.findUnique({
    where: { nickname },
    select: { id: true },
  });
  if (user) {
    console.log("닉네임 중복으로 사용 불가능 ❌");
    return {
      fieldErrors: {
        nickname: ["이 닉네임은 이미 사용중 입니다."],
      },
    };
  } else {
    console.log("닉네임 사용가능 ✅");
    return { success: true };
  }
};
