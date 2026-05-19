import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/aws/s3-client";
import { getCurrentProfile } from "@/lib/get-user";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const BUCKET_REGION = process.env.AWS_REGION!;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
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
        { success: false, error: "吏?먰븯吏 ?딅뒗 ?대?吏 ?뺤떇?낅땲??" },
        { status: 400 }
      );
    }

    if (
      typeof fileSize !== "number" ||
      !Number.isFinite(fileSize) ||
      fileSize <= 0 ||
      fileSize > MAX_UPLOAD_BYTES
    ) {
      return NextResponse.json(
      { success: false, error: "업로드 가능한 파일 크기를 초과했습니다." },
        { status: 400 }
      );
    }

    const extension = ALLOWED_IMAGE_TYPES.get(fileType);
    const key = `users/${user.id}/uploads/${randomUUID()}.${extension}`;
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    const finalUrl = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;

    return NextResponse.json({
      success: true,
      url: presignedUrl,
      key,
      finalUrl,
      maxSize: MAX_UPLOAD_BYTES,
    });
  } catch (error) {
    console.error("presigned URL creation failed:", error);
    return NextResponse.json(
      { success: false, error: "presigned URL ?앹꽦???ㅽ뙣?덉뒿?덈떎." },
      { status: 500 }
    );
  }
}
