import React, { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import HeroSection from "../components/HeroSection";
import ProgressBar from "../components/ProgressBar";
import PaymentCard from "../components/PaymentCard";
import QRModal from "../components/QRModal";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import styles from "./HomePage.module.css";

/**
 * الصفحة الرئيسية
 * تجمع كل الأقسام: Hero, Progress, Payment Cards, Contact, Footer
 */
export default function HomePage() {
  const { paymentMethods } = useApp();
  const [qrModal, setQrModal] = useState({ open: false, payment: null });

  const handleQrClick = useCallback((payment) => {
    setQrModal({ open: true, payment });
  }, []);

  const handleQrClose = useCallback(() => {
    setQrModal({ open: false, payment: null });
  }, []);

  return (
    <div className={styles.page}>
      <HeroSection />
      {/* <ProgressBar /> */}

      <h2 className={styles.sectionTitle}>وسائل الدفع المتاحة</h2>

      {paymentMethods.length > 0 ? (
        <div className={styles.paymentGrid}>
          {paymentMethods.map((pm, i) => (
            <PaymentCard
              key={pm.id}
              payment={pm}
              index={i}
              onQrClick={handleQrClick}
            />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <i className="fa-solid fa-inbox"></i>
          <p>لا توجد وسائل دفع حالياً</p>
        </div>
      )}

      <ContactSection />
      <Footer />

      <QRModal
        isOpen={qrModal.open}
        onClose={handleQrClose}
        payment={qrModal.payment}
      />
    </div>
  );
}
