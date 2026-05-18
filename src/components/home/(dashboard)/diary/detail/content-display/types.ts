import { DiaryWithRelations } from "../types";

export interface DiaryContentDisplayProps {
  diary: DiaryWithRelations;
  emotionsForBadgeList: {
    id: string;
    label: string;
    image: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }[];
}
