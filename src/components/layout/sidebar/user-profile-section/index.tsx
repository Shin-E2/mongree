import SidebarDropdown from "../dropdown";
import { ButtonOptionByProfileButton } from "@/commons/components/button-option";
import useSidebarUserProfileSection from "./hook";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";

export default function SidebarUserProfileSection() {
  const {
    dropdownRef,
    handleKeyDown,
    setIsDropdownOpen,
    isDropdownOpen,
    user,
  } = useSidebarUserProfileSection();

  return (
    <section className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      <ButtonOptionByProfileButton
        imageUrl={user?.profileImage ?? DEFAULT_PROFILE_IMAGE}
        title={user?.name!}
        description="내 프로필"
        isProfile
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      {isDropdownOpen && <SidebarDropdown />}
    </section>
  );
}
