import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { s3Client } from "@/lib/aws/s3-client";
import { getS3BucketConfig } from "@/lib/aws/s3-config";

export async function POST(request: Request) {
  try {
    const { fileName, fileType } = await request.json();
    const { bucketName, region } = getS3BucketConfig();

    const key = `${Date.now()}-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    const finalUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

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
