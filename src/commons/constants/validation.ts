export const FILE_CONSTRAINTS = {
  DIARY_IMAGE_MAX_BYTES: 2 * 1024 * 1024,
  PROFILE_IMAGE_MAX_BYTES: 3 * 1024 * 1024,
  DIARY_ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"] as string[],
  PROFILE_ALLOWED_TYPES: ["image/jpeg", "image/png"] as string[],
  MAX_COUNT: 3,
  PRESIGNED_URL_EXPIRES_SECONDS: 300,
} as const;
