import {
  DeleteObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/aws/s3-client";
import { getS3BucketConfig } from "@/lib/aws/s3-config";

interface UploadImageOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

function getKeyFromUrl(url: string) {
  const urlObj = new URL(url);
  return urlObj.pathname.substring(1);
}

// 서버 전용: S3에서 이미지 삭제
export async function deleteImageFromS3(imageUrl: string) {
  try {
    const key = getKeyFromUrl(imageUrl);
    const { bucketName } = getS3BucketConfig();
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
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

// 서버 전용: presigned URL 직접 생성 후 S3 업로드 (서버 액션에서 사용)
export async function uploadImageServer(
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
  const { bucketName, region } = getS3BucketConfig();

  const command = new PutObjectCommand({
    Bucket: bucketName,
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

  return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
}

// 클라이언트/서버 범용: /api/upload를 경유하는 업로드 (클라이언트 컴포넌트에서 사용)
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

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });

  if (!response.ok) {
    throw new Error("presigned URL 요청 실패");
  }

  const data = await response.json();

  if (!data.success || !data.url || !data.key) {
    throw new Error("잘못된 응답 형식");
  }

  const uploadResponse = await fetch(data.url, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });

  if (!uploadResponse.ok) {
    throw new Error("이미지 업로드에 실패했습니다");
  }

  return data.finalUrl as string;
}

export async function uploadMultipleImages(
  files: File[],
  options?: UploadImageOptions
) {
  return Promise.all(files.map((file) => uploadImageServer(file, options)));
}
