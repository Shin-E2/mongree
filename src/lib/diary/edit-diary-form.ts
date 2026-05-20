import { DIARY_IMAGE_ACCEPTED_TYPES } from "@/components/home/(dashboard)/diary/new/form.schema";
import { normalizeDiaryTags } from "./tag-normalizer";

export interface EditDiaryImagePayload {
  image_url: string;
  file_name: string;
  mime_type: string;
  file_size: number | null;
}

const getStringValue = (formData: FormData, key: string) =>
  String(formData.get(key) ?? "");

const getStringList = (formData: FormData, key: string) =>
  formData
    .getAll(key)
    .map((value) => String(value))
    .filter((value) => value.length > 0);

const getImageFiles = (formData: FormData) =>
  formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

function assertSupportedImages(imageFiles: File[]) {
  const invalidImage = imageFiles.find(
    (file) => !DIARY_IMAGE_ACCEPTED_TYPES.includes(file.type)
  );

  if (invalidImage) {
    throw new Error("이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.");
  }
}

export function extractEditDiaryFormData(formData: FormData) {
  const imageFiles = getImageFiles(formData);
  assertSupportedImages(imageFiles);

  return {
    title: getStringValue(formData, "title"),
    content: getStringValue(formData, "content"),
    isPrivate: formData.get("isPrivate") === "true",
    emotions: getStringList(formData, "emotions"),
    tags: normalizeDiaryTags(getStringValue(formData, "tags")),
    images: imageFiles,
    keptImageIds: getStringList(formData, "keptImageIds"),
  };
}

export function buildEditDiaryImagePayloads(
  imageUrls: string[],
  imageFiles: File[]
): EditDiaryImagePayload[] {
  return imageUrls.map((url, index) => ({
    image_url: url,
    file_name: imageFiles[index]?.name ?? `image_${index + 1}`,
    mime_type: imageFiles[index]?.type ?? "image/jpeg",
    file_size: imageFiles[index]?.size ?? null,
  }));
}
