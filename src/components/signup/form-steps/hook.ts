import type { SignupFormType } from "../step-basic-info/form.schema";
import { signup, uploadImageToS3 } from "./action";
import type { IuseSignupFormStepsProps } from "./types";

export default function useSignupFormSteps({
  setCurrentStep,
  currentStepData,
}: IuseSignupFormStepsProps) {
  // 다음
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // form onsubmit 동작 방지
    setCurrentStep((prev) => prev + 1);
  };

  // 이전
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 현재 단계의 컴포넌트
  const SignupStepComponent = currentStepData.Component;

  // form 제출
  const onSubmit = async (data: SignupFormType) => {
    try {
      let updatedData = { ...data };

      if (data.profileImage instanceof File) {
        const imageUrl = await uploadImageToS3(data.profileImage);
        // data.profileImage = imageUrl!;

        if (!imageUrl) {
          throw new Error("이미지 업로드 실패");
        }
        // 새로운 객체에 이미지 URL 설정
        updatedData = {
          ...updatedData,
          profileImage: imageUrl,
        };
        // setValue("profileImage", imageUrl);
      }

      // 업데이트된 데이터로 회원가입 진행
      const result = await signup(updatedData);
      console.log("회원가입 성공", result);
    } catch (error) {
      console.log("회원가입 실패:", error);
    }
  };

  return {
    handleNext,
    handlePrev,
    SignupStepComponent,
    onSubmit,
  };
}
