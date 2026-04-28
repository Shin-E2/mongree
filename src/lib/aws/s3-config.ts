export function getS3BucketConfig() {
  const bucketName =
    process.env.AWS_S3_BUCKET_NAME ??
    process.env.AWS_BUCKET ??
    process.env.AMPLIFY_BUCKET;
  const region = process.env.AWS_REGION;

  // S3 업로드 필수 환경변수 확인
  if (!bucketName) {
    throw new Error(
      "S3 버킷 환경변수가 설정되지 않았습니다. AWS_S3_BUCKET_NAME을 확인해주세요."
    );
  }

  if (!region) {
    throw new Error("AWS_REGION 환경변수가 설정되지 않았습니다.");
  }

  return { bucketName, region };
}
