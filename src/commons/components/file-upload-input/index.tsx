import React, { useCallback, ChangeEvent } from "react";
import type { IFileUploadInputProps } from "./types";
import styles from "./styles.module.css";

export default function FileUploadInput({
  label,
  onFileChange,
  placeholder = "클릭하여 파일을 업로드하세요",
  className,
  ...rest
}: IFileUploadInputProps) {
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (onFileChange) {
        onFileChange(event.target.files ? event.target.files[0] : null);
      }
    },
    [onFileChange]
  );

  return (
    <div className={`${styles.container} ${className || ""}`}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <label className={styles.dropzone}>
          <div className={styles.dropzoneContent}>
            <svg
              className={styles.icon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={styles.placeholder}>{placeholder}</p>
          </div>
          <input
            type="file"
            className={styles.fileInput}
            onChange={handleFileChange}
            {...rest}
          />
        </label>
      </div>
    </div>
  );
}
