"use server";

import db from "@/lib/db";
import {
  SignupFormSchema,
  SignupFormType,
} from "../step-basic-info/form.schema";
import * as bcrypt from "bcrypt";

/* 
// useActionState를 사용할 경우
export async function signup(prevState: any, formData: FormData) {
  const data = {
    name: formData.get("name"),
    nickname: formData.get("nickname"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    zoneCode: formData.get("zoneCode"),
    address: formData.get("address"),
    detailAddress: formData.get("detailAddress"),
  };

  console.log(data);
} */

export async function uploadImageToS3(file: File) {
  // 파일 타입 검증
  if (file.type !== "image/jpeg" && file.type !== "image/png") {
    alert("이미지 파일만 업로드 할 수 있습니다");
    return;
  }

  //파일 크기 확인(5MB)
  const fileSize = 5 * 1024 * 1024;
  if (file.size > fileSize) {
    alert("파일 크기는 5MB를 초과할 수 없습니다");
    return;
  }

  try {
    // S3에 업로드하기 위한 presigned URL 요청
    const response = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      throw new Error("미리 지정된 URL을 얻지 못했습니다.");
    }

    const { url, key } = await response.json(); // 응답에서 URL과 키 가져오기

    // S3에 이미지 업로드
    const uploadResponse = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type }, //파일 타입 설정
    });

    // 업로드 실패 오류
    if (!uploadResponse.ok) {
      throw new Error("이미지 업로드에 실패했습니다.");
    }

    const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET;
    const region = process.env.NEXT_PUBLIC_AWS_REGION;

    // 최종 S3 URL
    const finalImageUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return finalImageUrl;
  } catch (error) {
    console.error("이미지 처리 중 오류:", error);
    throw error; // 에러를 던져서 호출한 쪽에서 처리하도록 함
  }
}

export async function signup(data: SignupFormType) {
  console.log("회원가입 정보: ", data);

  const result = await SignupFormSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  }

  try {
    const {
      name,
      nickname,
      email,
      password,
      address: { zoneCode, address, detailAddress },
      profileImage,
    } = result.data;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("해싱된 비밀번호:", hashedPassword);

    // prisma type과 zod type 불일치 (string, file)
    const profileImageUrl =
      typeof profileImage === "string" ? profileImage : null;

    // 트랜잭션을 사용하여 사용자와 주소 생성
    const user = await db.$transaction(async (tx) => {
      // 사용자 생성
      const newUser = await tx.user.create({
        data: {
          name,
          nickname,
          email,
          password: hashedPassword,
          profileImage: profileImageUrl,
        },
      });

      // 주소 생성
      await tx.address.create({
        data: {
          zondCode: zoneCode ?? "",
          address: address ?? "",
          detailAddress: detailAddress ?? "",
          userId: newUser.id, // 생성된 사용자의 id 참조
        },
      });

      return newUser;
    });

    console.log("회원가입 성공", user);

    // const session = await getSession();
    // session.id = user.id;
    // await session.save();

    return { success: true, user };
  } catch (error) {
    console.error("회원가입 중 에러 발생: ", error);
    return { success: false, message: "회원가입 중 문제가 발생했습니다." };
  }
}
