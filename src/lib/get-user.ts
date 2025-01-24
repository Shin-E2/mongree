"use server";

import { notFound } from "next/navigation";
import db from "./db";
import { getSession } from "./session";

export async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) return user;
  } else {
    console.log("쿠키가 없습니다. 로그인을 다시 해주세요.");
  }
  //로그인 안한 사용자가 프로필 페이지로 들어오면 404 status페이지 보여줌
  notFound();
}
