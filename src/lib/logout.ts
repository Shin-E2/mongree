"use server";

import { redirect } from "next/navigation";
import { getSession } from "./session";

// 로그아웃 기능
export const logOut = async () => {
  const session = await getSession(); //쿠키 가져오기
  session.destroy(); //쿠키 삭제
  return redirect(`/`);
};
