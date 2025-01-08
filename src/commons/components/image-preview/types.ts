export interface IImagePreviewBaseProps {
  cssprop: string;
}

export interface IImagePreviewByProfileProps
  extends Omit<IImagePreviewBaseProps, "cssprop"> {}
