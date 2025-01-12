import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGIN,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToS3(file: File) {
  const fileName = `${Date.now()}-${file.name}`;
  const bucketName = process.env.AMPLIFY_BUCKET!;
  const region = process.env.AWS_REGIN!;

  //File 객체를 ArraryBuffer로 변환
  const photoData = await file.arrayBuffer();

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: new Uint8Array(photoData), // Uint8Array로 변환하여 전달
    ContentType: file.type, // 파일 MIME 타입 설정
  });

  try {
    await s3Client.send(command);

    //s3 객체 url 반환
    return `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error("S3 업로드 실패:", error);
    throw new Error("파일 업로드 중 문제가 발생했습니다.");
  }
}
