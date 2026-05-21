import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/aws/s3-client";
import { getCurrentProfile } from "@/lib/get-user";
import { FILE_CONSTRAINTS } from "@/commons/constants/validation";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const BUCKET_REGION = process.env.AWS_REGION!;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

export async function POST(request: Request) {
  try {
    const user = await getCurrentProfile();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const { fileType, fileSize } = (await request.json()) as {
      fileType?: string;
      fileSize?: number;
    };

    if (!fileType || !ALLOWED_IMAGE_TYPES.has(fileType)) {
      return NextResponse.json(
        { success: false, error: "지원하지 않는 이미지 형식입니다." },
        { status: 400 }
      );
    }

    if (
      typeof fileSize !== "number" ||
      !Number.isFinite(fileSize) ||
      fileSize <= 0 ||
      fileSize > FILE_CONSTRAINTS.DIARY_IMAGE_MAX_BYTES
    ) {
      return NextResponse.json(
        { success: false, error: "이미지는 2MB 이하로 줄인 뒤 업로드해야 합니다." },
        { status: 400 }
      );
    }

    if (!BUCKET_NAME || !BUCKET_REGION) {
      return NextResponse.json(
        { success: false, error: "이미지 저장소 설정이 누락되었습니다." },
        { status: 500 }
      );
    }

    const extension = ALLOWED_IMAGE_TYPES.get(fileType);
    const key = `users/${user.id}/diaries/${randomUUID()}.${extension}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: FILE_CONSTRAINTS.PRESIGNED_URL_EXPIRES_SECONDS,
    });

    const finalUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      url: presignedUrl,
      key,
      finalUrl,
      maxSize: FILE_CONSTRAINTS.DIARY_IMAGE_MAX_BYTES,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "업로드 URL 생성에 실패했습니다.";

    console.error("presigned URL 생성 실패:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
