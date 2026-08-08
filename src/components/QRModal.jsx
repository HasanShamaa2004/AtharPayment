import { useEffect, useRef } from "react";
import styles from "./QRModal.module.css";

/**
 * Modal لعرض QR Code بحجم كبير
 * يظهر عند النقر على QR في بطاقة الدفع
 */
export default function QRModal({ isOpen, onClose, payment }) {
  const overlayRef = useRef(null);
  const containerRef = useRef(null);

  // توليد QR Code في Modal
  useEffect(() => {
    if (isOpen && containerRef.current && payment) {
      containerRef.current.innerHTML = "";
      const qrData = `تبرع - ${payment.name}\nرقم: ${payment.accountNumber}\nاسم: ${payment.accountName}`;
      try {
        // eslint-disable-next-line no-undef
        new QRCode(containerRef.current, {
          text: qrData,
          width: 320,
          height: 320,
          colorDark: "#2D1B4E",
          colorLight: "#ffffff",
          // eslint-disable-next-line no-undef
          correctLevel: QRCode.CorrectLevel.M,
        });
      } catch (e) {
        console.error("QR Modal generation error:", e);
      }
    }
  }, [isOpen, payment]);

  // ESC to close + body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);
      return () => {
        window.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !payment) return null;

  const handleCopy = () => {
    const text = `تبرع - ${payment.name}\nرقم الحساب: ${payment.accountNumber}\nاسم الحساب: ${payment.accountName}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  };

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className={styles.modal}>
        <button
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="إغلاق"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h3 className={styles.title}>امسح الكود للتبرع</h3>
        <p className={styles.paymentName}>{payment.name}</p>

        {payment.image ? (
          <div className={styles.imageWrap}>
            <img
              src={payment.image}
              alt={`شعار ${payment.name}`}
              className={styles.paymentImage}
            />
          </div>
        ) : (
          <div className={styles.qrWrap}>
            <div ref={containerRef} className={styles.qrContainer}></div>
          </div>
        )}

        <div className={styles.info}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>رقم الحساب</span>
            <span className={styles.infoValue} dir="ltr">
              {payment.accountNumber}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>اسم الحساب</span>
            <span className={styles.infoValue}>{payment.accountName}</span>
          </div>
        </div>

        <button className={styles.copyBtn} onClick={handleCopy}>
          <i className="fa-solid fa-copy"></i> نسخ بيانات الحساب
        </button>
      </div>
    </div>
  );
}
