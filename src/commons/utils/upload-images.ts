import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/aws/s3-client";

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
const BUCKET_REGION = process.env.AWS_REGION!;

interface UploadImageOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

function getKeyFromUrl(url: string) {
  const urlObj = new URL(url);
  return urlObj.pathname.substring(1);
}

export async function deleteImageFromS3(imageUrl: string) {
  try {
    const key = getKeyFromUrl(imageUrl);
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error(`이미지 삭제 실패: ${imageUrl}`, error);
    throw error;
  }
}

export async function deleteImagesFromS3(imageUrls: string[]) {
  return Promise.all(imageUrls.map((url) => deleteImageFromS3(url)));
}

export async function uploadImage(
  file: File,
  options: UploadImageOptions = {}
) {
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ["image/jpeg", "image/png"],
  } = options;

  if (!allowedTypes.includes(file.type)) {
    throw new Error("지원하지 않는 이미지 형식입니다");
  }

  if (file.size > maxSize) {
    throw new Error(
      `파일 크기는 ${maxSize / (1024 * 1024)}MB를 초과할 수 없습니다`
    );
  }

  const key = `${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: file.type,
  });

  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!uploadResponse.ok) {
    throw new Error("이미지 업로드에 실패했습니다");
  }

  return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;
}

export async function uploadMultipleImages(
  files: File[],
  options?: UploadImageOptions
) {
  return Promise.all(files.map((file) => uploadImage(file, options)));
}
