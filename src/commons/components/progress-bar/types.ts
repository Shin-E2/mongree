export interface IProgressBarProps {
  cssprop: string;
  progress: number;
}

export interface IProgressBarStandardSFullProps
  extends Omit<IProgressBarProps, "cssprop"> {}
