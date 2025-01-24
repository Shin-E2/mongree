import { URL } from "@/commons/constants/global-url";
import type { SignupFormType } from "../step-basic-info/form.schema";
import { signup, uploadImageToS3 } from "./action";
import type { IuseSignupFormStepsProps } from "./types";
import { useMoveToPage } from "@/commons/hooks/use-move-to-page.hook";
import useModal from "@/commons/hooks/use-modal.hook";

export default function useSignupFormSteps({
  setCurrentStep,
  currentStepData,
}: IuseSignupFormStepsProps) {
  // const { formState } = useForm();
  // const [successMessage, setSuccessMessage] = useState(false);

  // 닉네임 중복 검사 상태와 폼 상태 조합
  // const isNextButtonEnabled = formState.isValid && !!successMessage;

  const { moveToPage } = useMoveToPage(); // 페이지 이동
  const { isOpen, setIsOpen } = useModal(); // 모달

  // 다음
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // form onsubmit 동작 방지
    setCurrentStep((prev) => prev + 1);
  };

  // 이전
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // 모달 ok 누르면 로그인 페이지로 이동하기
  const handleOk = () => {
    moveToPage(URL().LOGIN)();
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
      setIsOpen(true); // 모달 오픈
    } catch (error) {
      console.log("회원가입 실패:", error);
    }
  };

  return {
    handleNext,
    handlePrev,
    SignupStepComponent,
    onSubmit,
    handleOk,
    isOpen,
    // isNextButtonEnabled,
  };
}
