import styles from "./styles.module.css";
import SidebarNavigation from "./navigation";
import MobileNavigation from "./navigation/mobile-navigation";

export default function SideBar() {
  return (
    <>
      <aside className={styles.aside}>
        <SidebarNavigation />
      </aside>

      <nav className={styles.mobile_nav}>
        <div className={styles.mobile_nav_container}>
          <MobileNavigation />
        </div>
      </nav>
    </>
  );
}
