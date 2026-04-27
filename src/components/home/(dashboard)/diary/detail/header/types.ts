export interface DiaryDetailHeaderProps {
  isOwner: boolean;
  diaryId: string;
  isPrivate: boolean;
  setShowDeleteModal: (show: boolean) => void;
}
