import { ImagePreviewByProfile } from "@/commons/components/image-preview";
import { useRef, useState } from "react";

export const DEFAULT_PROFILE_IMAGE = `/image/default-profile.png`;

export default function SignupStepProfileCheck() {
  // 파일 입력 요소참조
  const fileRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_PROFILE_IMAGE); // 이미지 미리보기 url
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택한 이미지
  const [isHovered, setIsHovered] = useState(false); // 삭제

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // 선택된 파일
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      console.log("선택한 사진: ", file);

      // Form에 파일 데이터 설정
      // setValue("image", file, {
      //   shouldValidate: true, // 유효성 검사: zod에서 설정해둠
      // });
      setSelectedImage(file);

      // FileReader를 사용하여 이미지를 data url로 변환 --> 이미지 미리보기
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.onerror = () => {
        throw new Error("이미지 파일을 읽는 중 오류가 발생했습니다.");
      };
      fileReader.readAsDataURL(file);
    } catch (error) {
      console.error("이미지 처리 중 오류:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-xl font-semibold">프로필 설정</h2>
      <div className="flex flex-col items-center">
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* 이미지 미리보기 */}
          <ImagePreviewByProfile
            src={previewUrl}
            showDeleteIcon={isHovered && selectedImage !== null}
          />
        </div>

        {/* 숨김 파일 입력 */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}
