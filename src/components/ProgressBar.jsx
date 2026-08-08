// import { useState, useEffect, useRef } from "react";
// import { useApp } from "../context/AppContext";
// import styles from "./ProgressBar.module.css";

// /**
//  * شريط التقدم
//  * يعرض نسبة التبرعات مع animation و count-up للأرقام
//  */

// /* Hook مخصص لعمل count-up للأرقام */
// function useCountUp(target, duration = 1500, startOnMount = true) {
//   const [count, setCount] = useState(0);
//   const rafRef = useRef(null);
//   const startTimeRef = useRef(null);

//   useEffect(() => {
//     if (!startOnMount || target === 0) {
//       setCount(target);
//       return;
//     }

//     const animate = (timestamp) => {
//       if (!startTimeRef.current) startTimeRef.current = timestamp;
//       const elapsed = timestamp - startTimeRef.current;
//       const progress = Math.min(elapsed / duration, 1);
//       // easing: ease-out cubic
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setCount(Math.round(eased * target));
//       if (progress < 1) {
//         rafRef.current = requestAnimationFrame(animate);
//       }
//     };

//     rafRef.current = requestAnimationFrame(animate);
//     return () => {
//       if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     };
//   }, [target, duration, startOnMount]);

//   return count;
// }

// function formatNum(n) {
//   return Number(n).toLocaleString("ar-SY");
// }

// export default function ProgressBar() {
//   const { siteSettings } = useApp();
//   const { goalAmount, currentAmount, donorsCount, daysLeft } = siteSettings;

//   const [visible, setVisible] = useState(false);
//   const sectionRef = useRef(null);

//   const displayAmount = useCountUp(currentAmount, 1800, visible);
//   const displayGoal = useCountUp(goalAmount, 1800, visible);
//   const displayDonors = useCountUp(donorsCount, 1200, visible);
//   const displayDays = useCountUp(daysLeft, 1000, visible);

//   const percentage =
//     goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0;

//   // Intersection Observer للظهور عند التمرير
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.3 },
//     );
//     if (sectionRef.current) observer.observe(sectionRef.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <section className={styles.section} ref={sectionRef}>
//       <div className={styles.card}>
//         <div className={styles.amountLine}>
//           <span className={styles.amountLabel}>تم جمع</span>
//           <span className={styles.amountValue}>
//             <strong>{formatNum(displayAmount)}</strong>
//             <span className={styles.amountGoal}>
//               {" "}
//               / {formatNum(displayGoal)} ل.س
//             </span>
//           </span>
//         </div>

//         <div className={styles.barBg}>
//           <div
//             className={`${styles.barFill} ${visible ? styles.barAnimate : ""}`}
//             style={{ width: visible ? `${percentage}%` : "0%" }}
//           >
//             <div className={styles.shimmer} />
//           </div>
//         </div>

//         <div className={styles.stats}>
//           <div className={styles.statItem}>
//             <div className={styles.statNum}>{Math.round(percentage)}%</div>
//             <div className={styles.statLabel}>نسبة الإنجاز</div>
//           </div>
//           <div className={styles.statItem}>
//             <div className={styles.statNum}>{formatNum(displayDonors)}</div>
//             <div className={styles.statLabel}>عدد المتبرعين</div>
//           </div>
//           <div className={styles.statItem}>
//             <div className={styles.statNum}>{displayDays}</div>
//             <div className={styles.statLabel}>أيام متبقية</div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
