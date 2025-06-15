import { ModalStandardFitFit } from "@/commons/components/modal";

export interface DiaryDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  deleteError: string;
  isPending: boolean;
  handleDeleteWithError: () => Promise<void>;
} 