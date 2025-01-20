import { ButtonIconSocial } from "@/commons/components/button-icon";
import { ButtonTextStandardSFull } from "@/commons/components/button-text";
import { FormStandardFullFull } from "@/commons/components/form";
import { InputFieldStandardSFull } from "@/commons/components/input-field";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">토닥토닥</h1>
            <p className="mt-2 text-gray-600">로그인하여 시작하세요</p>
          </div>
          {/* 로그인 */}
          <FormStandardFullFull onSubmit={() => {}}>
            {/* 이메일 입력 필드 */}
            <InputFieldStandardSFull
              name="email"
              title="이메일"
              type="email"
              placeholder="이메일을 입력하세요"
              required
            />

            {/* 비밀번호 입력 필드 */}
            <InputFieldStandardSFull
              name="password"
              title="비밀번호"
              type="password"
              placeholder="비밀번호를 입력하세요"
              required
            />

            {/* 아이디/비밀번호 찾기 기능은 추후 구현 예정 */}
            {/* <div className="flex justify-end">
          <Button variant="link" className="text-sm text-gray-600">
            아이디/비밀번호 찾기
          </Button>
        </div> */}

            {/* 로그인 버튼 */}
            <ButtonTextStandardSFull title="로그인" type="submit" />
          </FormStandardFullFull>

          <div className="space-y-6">
            {/* 구분선과 텍스트 */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">간편 로그인</span>
              </div>
            </div>

            {/* 소셜 로그인 버튼들 */}
            <div className="flex justify-center space-x-4">
              <ButtonIconSocial provider="google" />
              <ButtonIconSocial provider="kakao" />
              <ButtonIconSocial provider="naver" />
            </div>
          </div>
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">계정이 없으신가요?</span>
            <Link
              href="/signup"
              className="ml-2 text-sm text-indigo-600 hover:text-indigo-500"
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
