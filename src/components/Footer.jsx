import { useApp } from "../context/AppContext";
import styles from "./Footer.module.css";

/**
 * Footer الصفحة الرئيسية
\ */
export default function Footer() {
  const { siteSettings } = useApp();

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p className={styles.text}>
          صُنع بـ 💜 من {siteSettings.teamName} © 2026
        </p>
      </div>
    </footer>
  );
}
