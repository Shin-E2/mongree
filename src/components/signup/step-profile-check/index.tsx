import { ImagePreviewByProfile } from "@/commons/components/image-preview";

export default function SignupStepProfileCheck() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <h2 className="text-xl font-semibold">프로필 설정</h2>
      <div className="flex flex-col items-center">
        {/* 이미지 미리보기 */}
        <ImagePreviewByProfile />
      </div>
    </div>
  );
}
