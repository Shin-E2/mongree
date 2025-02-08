import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

interface UploadImageOptions {
  maxSize?: number; // 5mb
  allowedTypes?: string[]; // jpeg, png
}

// S3 클라이언트 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGIN,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// URL에서 S3 키를 추출
function getKeyFromUrl(url: string) {
  const urlObj = new URL(url);
  // URL 경로에서 버킷 이름 이후의 부분이 키
  return urlObj.pathname.substring(1);
}

// 이미지 삭제
export async function deleteImageFromS3(imageUrl: string) {
  try {
    const key = getKeyFromUrl(imageUrl);
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET!,
      Key: key,
    });

    await s3Client.send(command);
    console.log(`이미지 삭제 성공: ${key}`);
  } catch (error) {
    console.error(`이미지 삭제 실패: ${imageUrl}`, error);
    throw error;
  }
}

// 여러 이미지 삭제
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

  // 파일 유효성 검사
  if (!allowedTypes.includes(file.type)) {
    throw new Error("지원하지 않는 이미지 형식입니다");
  }

  if (file.size > maxSize) {
    throw new Error(
      `파일 크기는 ${maxSize / (1024 * 1024)}MB를 초과할 수 없습니다`
    );
  }

  try {
    // 현재 환경의 base URL을 가져옵니다
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || ""; // 환경변수 추가 필요

    // Presigned URL 요청
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!response.ok) {
      console.error("API 응답 에러:", await response.text()); // 자세한 에러 정보 로깅
      throw new Error("미리 지정된 URL을 얻지 못했습니다");
    }

    const data = await response.json();

    if (!data.success || !data.url || !data.key) {
      console.error("API 응답 데이터:", data); // 응답 데이터 로깅
      throw new Error("잘못된 응답 형식");
    }

    // S3 업로드
    const uploadResponse = await fetch(data.url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    if (!uploadResponse.ok) {
      throw new Error("이미지 업로드에 실패했습니다");
    }

    // 최종 URL 생성
    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${data.key}`;
  } catch (error) {
    console.error("이미지 처리 중 상세 오류:", error);
    throw error;
  }
}

// 여러 이미지
export async function uploadMultipleImages(
  files: File[],
  options?: UploadImageOptions
) {
  return Promise.all(files.map((file) => uploadImage(file, options)));
}
