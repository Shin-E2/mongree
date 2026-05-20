const IMAGE_UPLOAD_MAX_BYTES = 2 * 1024 * 1024;
const IMAGE_COMPRESS_TARGET_BYTES = 900 * 1024;
const IMAGE_MAX_DIMENSION = 1600;
const IMAGE_OUTPUT_TYPE = "image/jpeg";
const IMAGE_OUTPUT_EXTENSION = "jpg";

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("이미지 압축에 실패했습니다."));
          return;
        }
        resolve(blob);
      },
      type,
      quality
    );
  });
}

function getCompressedFileName(fileName: string) {
  const baseName = fileName.replace(/\.[^.]+$/, "") || "diary-image";
  return `${baseName}.${IMAGE_OUTPUT_EXTENSION}`;
}

async function loadImage(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = objectUrl;
    await image.decode();
    return image;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function compressDiaryImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }

  const image = await loadImage(file);
  const scale = Math.min(
    1,
    IMAGE_MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight)
  );
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("이미지를 처리할 수 없습니다.");
  }

  context.drawImage(image, 0, 0, width, height);

  let quality = 0.82;
  let blob = await canvasToBlob(canvas, IMAGE_OUTPUT_TYPE, quality);

  while (blob.size > IMAGE_COMPRESS_TARGET_BYTES && quality > 0.52) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, IMAGE_OUTPUT_TYPE, quality);
  }

  if (blob.size > IMAGE_UPLOAD_MAX_BYTES) {
    throw new Error("이미지를 충분히 줄이지 못했습니다. 더 작은 이미지를 선택해주세요.");
  }

  return new File([blob], getCompressedFileName(file.name), {
    type: IMAGE_OUTPUT_TYPE,
    lastModified: Date.now(),
  });
}

export async function uploadDiaryImage(file: File) {
  const compressedFile = await compressDiaryImage(file);

  const response = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileType: compressedFile.type,
      fileSize: compressedFile.size,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success || !data.url || !data.finalUrl) {
    throw new Error(data?.error ?? "이미지 업로드 URL을 생성하지 못했습니다.");
  }

  const uploadResponse = await fetch(data.url, {
    method: "PUT",
    body: compressedFile,
    headers: { "Content-Type": compressedFile.type },
  });

  if (!uploadResponse.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  return data.finalUrl as string;
}
