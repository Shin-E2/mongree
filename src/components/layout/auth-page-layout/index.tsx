import styles from "./styles.module.css";
import type { IAuthPageLayoutProps } from "./types";

export default function AuthPageLayout({ children }: IAuthPageLayoutProps) {
  return (
    <main className={styles.container}>
      <div className={styles.contentWrapper}>{children}</div>
    </main>
  );
}
