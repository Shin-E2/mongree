"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_ITEMS } from "./constants";
import styles from "./styles.module.css";

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
            aria-label={item.label}
          >
            <item.icon className={styles.navIcon} />
            <span className={styles.tooltip}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
