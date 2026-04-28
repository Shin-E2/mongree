"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ImageThumbnailProps } from "./types";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import styles from "./styles.module.css";

export const ImageThumbnail = ({
  src,
  alt,
  width,
  height,
  shape = "square",
  className,
}: ImageThumbnailProps) => {
  const [imageSrc, setImageSrc] = useState(src || DEFAULT_PROFILE_IMAGE);

  useEffect(() => {
    setImageSrc(src || DEFAULT_PROFILE_IMAGE);
  }, [src]);

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div
      className={`flex-shrink-0 overflow-hidden ${
        shape === "circle" ? `w-[${width}px] h-[${height}px]` : ""
      } ${shapeClass} ${className || ""}`}
      style={shape === "square" ? { width, height } : undefined}
    >
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={styles.imageFill}
        onError={() => setImageSrc(DEFAULT_PROFILE_IMAGE)}
      />
    </div>
  );
};
