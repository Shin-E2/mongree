import { getSession } from "./session";

/* 
- 사용자가 로그인에 성공하면 id를 섹션 객체에 저장
- session.save()는 업데이트된 세션 데이터를 쿠키에 저장
*/

// user정보가 넘어옴
export const login = async (id: string) => {
  const session = await getSession();
  session.id = id; // 사용자 id를 세션에 저장
  await session.save(); // 세션을 저장
};
