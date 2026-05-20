interface ValidateDiaryImagesParams {
  files: File[];
  currentCount: number;
  maxCount: number;
  acceptedTypes: readonly string[];
}

export function validateDiaryImages({
  files,
  currentCount,
  maxCount,
  acceptedTypes,
}: ValidateDiaryImagesParams): string | null {
  if (currentCount + files.length > maxCount) {
    return `이미지는 최대 ${maxCount}개까지 등록할 수 있습니다.`;
  }

  const hasUnsupportedType = files.some(
    (file) => !acceptedTypes.includes(file.type)
  );

  if (hasUnsupportedType) {
    return "이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.";
  }

  return null;
}
