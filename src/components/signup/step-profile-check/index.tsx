import { ImagePreviewByProfile } from "@/commons/components/image-preview";
import { useFormContext } from "react-hook-form";
import type { SignupFormType } from "../step-basic-info/form.schema";

export default function SignupStepProfileCheck() {
  const {
    register,
    formState: { errors },
  } = useFormContext<SignupFormType>();

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
