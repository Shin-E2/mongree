import SidebarDropdown from "../dropdown";
import { ButtonOptionByProfileButton } from "@/commons/components/button-option";
import useSidebarUserProfileSection from "./hook";
import { DEFAULT_PROFILE_IMAGE } from "@/commons/constants/default-profile-image";
import styles from "./styles.module.css";

export default function SidebarUserProfileSection() {
  const {
    dropdownRef,
    handleKeyDown,
    setIsDropdownOpen,
    isDropdownOpen,
    user,
  } = useSidebarUserProfileSection();

  return (
    <section
      className={styles.profileSection}
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <ButtonOptionByProfileButton
        profile_image={user?.profile_image ?? DEFAULT_PROFILE_IMAGE}
        title={user?.username ?? "사용자"}
        description="내 프로필"
        isProfile
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      {isDropdownOpen && <SidebarDropdown />}
    </section>
  );
}
