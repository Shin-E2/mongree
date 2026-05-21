import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToS3(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME!;
  const region = process.env.AWS_REGION!;

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
    console.error("S3 업로드 실패:", error);
    throw new Error("파일 업로드 중 문제가 발생했습니다.");
  }
}
