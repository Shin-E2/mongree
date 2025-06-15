import { InputHTMLAttributes } from "react";

export interface IFileUploadInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string; // 파일 업로드 필드의 레이블
  onFileChange?: (file: File | null) => void; // 파일 변경 시 호출되는 콜백 함수
  placeholder?: string; // 플레이스홀더 텍스트
  className?: string; // 추가적인 스타일 클래스
} 