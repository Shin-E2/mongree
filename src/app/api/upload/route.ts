import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

// aws에서 이미지 업로드 하기
const s3Client = new S3Client({
  //s3 클라이언트 연결
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!, // ACCESS키
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!, // ACCESS 비밀 키
  },
});

export async function POST(request: Request) {
  try {
    // 클라이언트로부터 JSON 형식으로 파일 이름과 파일 타입을 가져옴
    const { fileName, fileType } = await request.json();

    const key = `${Date.now()}-${fileName}`;
    // S3에 객체를 업로드하기 위한 PutObjectCommand 생성
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET!, // 버킷이름
      Key: key, // S3에 저장할 파일 이름
      ContentType: fileType,
    });

    // presigned URL 생성 (유효 기간 1시간)
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600, //3600초 -> 1시간
    });

    // 성공적으로 presigned URL을 생성한 경우, 클라이언트에 응답
    return NextResponse.json({
      success: true,
      url: presignedUrl,
      key,
    });
  } catch (error) {
    console.error("미리 지정된 URL을 생성하지 못했습니다:", error);
    return NextResponse.json(
      { success: false, error: "미리 지정된 URL을 생성하지 못했습니다." },
      { status: 500 } // HTTP 상태 코드 500 (서버 오류)
    );
  }
}
