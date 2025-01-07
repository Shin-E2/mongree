export interface IImagePreviewBaseProps {
  cssprop: string;
  src: string;
  showDeleteIcon?: boolean;
}

export interface IImagePreviewByProfileProps
  extends Omit<IImagePreviewBaseProps, "cssprop"> {}
