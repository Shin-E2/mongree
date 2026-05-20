import { DIARY_IMAGE_ACCEPTED_TYPES } from "@/components/home/(dashboard)/diary/new/form.schema";
import { normalizeDiaryTags } from "./tag-normalizer";

export interface EditDiaryImagePayload {
  image_url: string;
  file_name: string;
  mime_type: string;
  file_size: number | null;
}

export function extractEditDiaryFormData(formData: FormData) {
  const imageFiles = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File && file.size > 0);

  const invalidImage = imageFiles.find(
    (file) => !DIARY_IMAGE_ACCEPTED_TYPES.includes(file.type)
  );

  if (invalidImage) {
    throw new Error("이미지는 JPG 또는 PNG 파일만 등록할 수 있습니다.");
  }

  return {
    title: String(formData.get("title") ?? ""),
    content: String(formData.get("content") ?? ""),
    isPrivate: formData.get("isPrivate") === "true",
    emotions: formData.getAll("emotions").map((emotion) => String(emotion)),
    tags: normalizeDiaryTags(String(formData.get("tags") ?? "")),
    images: imageFiles,
    keptImageIds: formData
      .getAll("keptImageIds")
      .map((imageId) => String(imageId)),
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
