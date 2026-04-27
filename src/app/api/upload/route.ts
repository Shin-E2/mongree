import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/aws/s3-client";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const BUCKET_REGION = process.env.AWS_REGION!;

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();

    const key = `${Date.now()}-${fileName}`;
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
    });
  } catch (error) {
    console.error("presigned URL 생성 실패:", error);
    return NextResponse.json(
      { success: false, error: "presigned URL 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
