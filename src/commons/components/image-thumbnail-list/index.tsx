import { ImageThumbnail } from "@/commons/components/image-thumbnail";
import type { IImageThumbnailListProps } from "./types";
import styles from "./styles.module.css";

export default function ImageThumbnailList({
  images,
  className,
}: IImageThumbnailListProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {images.map((image, index) => (
        <ImageThumbnail
          key={index}
          src={image}
          alt={`이미지 ${index + 1}`}
          width={64} // 16*4 = 64px (w-16) (tailwind config에 따라 조절)
          height={64} // 16*4 = 64px (h-16)
          className={styles.imageThumbnail}
        />
      ))}
    </div>
  );
}
