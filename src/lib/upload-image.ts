import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`환경변수 ${name}이 설정되지 않았습니다.`);
  return val;
}

const s3Client = new S3Client({
  region: requireEnv("AWS_REGION"),
  credentials: {
    accessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
  },
});

export async function uploadImageToS3(file: File) {
  const ext = file.name.split(".").pop() ?? "bin";
  const fileName = `${randomUUID()}.${ext}`;
  const bucketName = requireEnv("AWS_S3_BUCKET_NAME");
  const region = requireEnv("AWS_REGION");

  const photoData = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: new Uint8Array(photoData),
    ContentType: file.type,
  });

  try {
    await s3Client.send(command);
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("[S3] 업로드 실패:", error);
    throw new Error("파일 업로드 중 문제가 발생했습니다.");
  }
}
