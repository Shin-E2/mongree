import SidebarNavigation from "./navigation";
import SidebarUserProfileSection from "./user-profile-section";
import { ButtonTextLogo } from "@/commons/components/button-text";
import { URL } from "@/commons/constants/global-url";
import styles from "./styles.module.css";

export default function SideBar() {
  return (
    <aside className={styles.aside}>
      <div className={styles.aside_div}>
        {/* Logo */}
        <ButtonTextLogo href={URL().HOME} title="mongree" />
        {/* Navigation */}
        <SidebarNavigation />
        {/* User Profile */}
        <SidebarUserProfileSection />
      </div>
    </aside>
  );
}
