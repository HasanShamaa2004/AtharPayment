import { useApp } from "../context/AppContext";
import styles from "./Toast.module.css";

/**
 * نظام الإشعارات (Toast)
 * يعرض إشعارات مؤقتة مع progress bar
 */
export default function Toast() {
  const { toasts } = useApp();

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type] || styles.info}`}
        >
          <div className={styles.icon}>
            {toast.type === "success" && (
              <i className="fa-solid fa-check-circle"></i>
            )}
            {toast.type === "error" && (
              <i className="fa-solid fa-times-circle"></i>
            )}
            {toast.type === "info" && (
              <i className="fa-solid fa-info-circle"></i>
            )}
          </div>
          <span className={styles.message}>{toast.message}</span>
          <div className={styles.progress}>
            <div
              className={`${styles.progressBar} ${styles["bar_" + toast.type]}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
