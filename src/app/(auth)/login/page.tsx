import LoginFormTitle from "./../../../components/login/form-title/index";
import LoginFormSection from "@/components/login/form-section";
import LoginSocialSection from "@/components/login/social-section";
import LoginSignupSection from "@/components/login/signup-section";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          {/* 글씨 */}
          <LoginFormTitle />
          {/* 일반 로그인 */}
          <LoginFormSection />
          {/* 소셜 로그인 */}
          <LoginSocialSection />
          {/* 회원가입 */}
          <LoginSignupSection />
        </div>
      </div>
    </div>
  );
}
