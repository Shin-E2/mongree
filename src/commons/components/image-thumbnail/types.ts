import { StaticImageData } from "next/image";

export interface ImageThumbnailProps {
  src: string | StaticImageData | null | undefined;
  alt: string;
  width: number;
  height: number;
  shape?: "circle" | "square";
  className?: string;
} 