import { useApp } from "../context/AppContext";
import styles from "./ContactSection.module.css";

/**
 * قسم التواصل
 * يعرض أزرار واتساب / هاتف / بريد
 */
export default function ContactSection() {
  const { siteSettings } = useApp();
  const { whatsapp, phone, email } = siteSettings;

  const contacts = [];
  if (whatsapp) {
    contacts.push({
      icon: "fa-brands fa-whatsapp",
      label: "واتساب",
      value: whatsapp,
      href: `https://wa.me/${whatsapp}`,
      external: true,
    });
  }
  if (phone) {
    contacts.push({
      icon: "fa-solid fa-phone",
      label: "الهاتف",
      value: phone,
      href: `tel:${phone}`,
    });
  }
  if (email) {
    contacts.push({
      icon: "fa-solid fa-envelope",
      label: "البريد الإلكتروني",
      value: email,
      href: `mailto:${email}`,
    });
  }

  if (contacts.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>تواصل معنا</h2>
      <div className={styles.grid}>
        {contacts.map((c, i) => (
          <a
            key={i}
            href={c.href}
            target={c.external ? "_blank" : undefined}
            rel={c.external ? "noopener noreferrer" : undefined}
            className={styles.card}
          >
            <i className={`${c.icon} ${styles.cardIcon}`}></i>
            <h4 className={styles.cardLabel}>{c.label}</h4>
            <span className={styles.cardValue} dir="ltr">
              {c.value}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
