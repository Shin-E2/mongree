import Link from "next/link";
import styles from "./styles.module.css";
import type { IMobileNavItemProps } from "./types";

export default function MobileNavItem({
  path,
  icon: Icon,
  label,
  isActive,
  isHome,
}: IMobileNavItemProps) {
  const dynamicClassName = `${styles.nav_item} ${
    isActive ? styles.nav_item_active : styles.nav_item_inactive
  } ${isHome ? styles.nav_item_home : ""}`;

  const iconClassName = `${styles.nav_icon} ${
    isHome ? styles.nav_icon_home : ""
  }`;

  return (
    <Link href={path} className={dynamicClassName}>
      <Icon className={iconClassName} />
      <span className={styles.nav_label}>{label}</span>
    </Link>
  );
}
