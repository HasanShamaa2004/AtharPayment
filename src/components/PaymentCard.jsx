import { useState, useRef, useEffect } from "react";
import styles from "./PaymentCard.module.css";

/**
 * بطاقة وسيلة الدفع
 * تعرض: الأيقونة، الاسم، الوصف، بيانات الحساب، QR Code
 * تدعم: نسخ الحساب، فتح QR في Modal، hover 3D
 */
export default function PaymentCard({ payment, index, onQrClick }) {
  const [copied, setCopied] = useState(false);
  const cardRef = useRef(null);
  const qrRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const { name, accountNumber, accountName, description, icon, color, image } =
    payment;

  // QR data بالنص المنسق
  const qrData = `تبرع - ${name}\nرقم: ${accountNumber}\nاسم: ${accountName}`;

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 150);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  // توليد QR Code فقط إذا لم يكن هناك صورة للحساب
  useEffect(() => {
    if (qrRef.current && visible && !image) {
      qrRef.current.innerHTML = "";
      try {
        // eslint-disable-next-line no-undef
        new QRCode(qrRef.current, {
          text: qrData,
          width: 130,
          height: 130,
          colorDark: "#2D1B4E",
          colorLight: "#ffffff",
          // eslint-disable-next-line no-undef
          correctLevel: QRCode.CorrectLevel.M,
        });
      } catch (e) {
        console.error("QR generation error:", e);
      }
    }
  }, [visible, qrData, image]);

  // Copy to clipboard
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber);
    } else {
      const ta = document.createElement("textarea");
      ta.value = accountNumber;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // QR click handler
  const handleQrClick = () => {
    if (onQrClick) onQrClick(payment);
  };

  // 3D tilt
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-10px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform =
        "perspective(1000px) rotateY(0deg) rotateX(0deg) translateY(0)";
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${styles[color]} ${visible ? styles.visible : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.topStripe} />

      {/* Header */}
      <div className={styles.header}>
        <div className={`${styles.icon} ${styles["icon_" + color]}`}>
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <div>
          <div className={styles.name}>{name}</div>
          {description && <div className={styles.desc}>{description}</div>}
        </div>
      </div>

      {/* Account Details */}
      <div className={styles.details}>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>رقم الحساب</span>
          <span className={styles.detailValue} dir="ltr">
            {accountNumber}
          </span>
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailLabel}>اسم الحساب</span>
          <span className={styles.detailValue}>{accountName}</span>
        </div>
      </div>

      {/* Copy Button */}
      <button
        className={`${styles.copyBtn} ${copied ? styles.copied : ""}`}
        onClick={handleCopy}
      >
        <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`}></i>
        {copied ? "تم النسخ" : "نسخ رقم الحساب"}
      </button>

      {/* QR Code */}
      <div className={styles.qrSection}>
        <div
          className={styles.qrWrap}
          onClick={handleQrClick}
          title="اضغط للتكبير"
        >
          {image ? (
            <img src={image} alt={name} className={styles.previewImage} />
          ) : (
            <div ref={qrRef} className={styles.qrCode}></div>
          )}
        </div>
        <div className={styles.qrHint}>
          <i className="fa-solid fa-qrcode"></i>
          {image ? " اضغط على الصورة للتكبير" : " اضغط على الكود للتكبير"}
        </div>
      </div>
    </div>
  );
}
