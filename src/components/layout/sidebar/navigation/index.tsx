"use client";

import { usePathname } from "next/navigation";
import { ButtonOptionStandardSFull } from "@/commons/components/button-option";
import { NAV_ITEMS } from "./constants";
import styles from "./styles.module.css";

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <ButtonOptionStandardSFull
          key={item.path}
          cssprop={`${styles.nav_button} ${
            pathname === item.path ? styles.nav_current_backgroundColor : ""
          }`}
          icon={
            <item.icon
              className={`${styles.nav_icon} ${
                pathname === item.path
                  ? styles.nav_current
                  : styles.nav_not_current_title
              }`}
            />
          }
          title={item.label}
          titleColor={
            pathname === item.path
              ? styles.nav_current
              : styles.nav_not_current_title
          }
          href={item.path}
        />
      ))}
    </nav>
  );
}
