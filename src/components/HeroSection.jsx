import { useApp } from "../context/AppContext";
import styles from "./HeroSection.module.css";
import logo from "../data/60187.png";
export default function HeroSection() {
  const { siteSettings } = useApp();
  const logoSrc = siteSettings.logoUrl || siteSettings.siteIcon || logo;

  return (
    <section className={styles.hero}>
      <div className={styles.particles}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={styles.particle}
            style={{
              "--delay": `${i * 1.5}s`,
              "--size": `${20 + i * 12}px`,
              "--x": `${10 + i * 12}%`,
              "--duration": `${6 + i * 2}s`,
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        {/* الشعار */}
        <div className={styles.logoWrap}>
          <img src={logoSrc} alt="شعار الفريق" className={styles.logoImg} />
        </div>

        {/* العنوان */}
        <h1 className={styles.title}>تبرع لـ {siteSettings.teamName}</h1>

        {/* الوصف */}
        <p className={styles.description}>{siteSettings.teamDescription}</p>

        {/* Badge */}
        <div className={styles.badge}>
          <i className="fa-solid fa-shield-halved"></i>
          تبرع آمن 100%
        </div>
      </div>

      {/* Wave Divider */}
      <div className={styles.waveWrap}>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className={styles.waveSvg}
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7B5AA6" />
              <stop offset="100%" stopColor="#2EC4B6" />
            </linearGradient>
          </defs>
          <path
            className={styles.wavePath1}
            fill="url(#waveGrad)"
            d="M0,40 C240,100 480,0 720,60 C960,120 1200,20 1440,50 L1440,120 L0,120 Z"
          />
          <path
            className={styles.wavePath2}
            fill="url(#waveGrad)"
            opacity="0.5"
            d="M0,60 C360,0 720,100 1080,40 C1260,10 1380,30 1440,60 L1440,120 L0,120 Z"
          />
        </svg>
      </div>
    </section>
  );
}
