import type { useImageUpload } from "@/commons/hooks/use-image-upload";
import ImageUploadField from "../shared/image-upload-field";
import styles from "./styles.module.css";

type ImageState = ReturnType<typeof useImageUpload>;

interface ImageFieldProps {
  imageState: ImageState;
}

export default function ImageField({ imageState }: ImageFieldProps) {
  const notice = (
    <p className={styles.imageNotice}>
      기존 이미지를 삭제하거나 새 이미지를 추가할 수 있습니다. 총
      {imageState.maxCount}개까지 저장됩니다.
    </p>
  );

  return <ImageUploadField imageState={imageState} styles={styles} notice={notice} />;
}
