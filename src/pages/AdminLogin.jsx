import React, { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import styles from "./AdminLogin.module.css";

/**
 * صفحة تسجيل الدخول للأدمن
 * تتبع نظام الحماية:
 * 1. تظهر صفحة 404 مزيفة أولاً
 * 2. اضغط "K" 3 مرات متوالية لتظهر صفحة Login
 * 3. كلمة المرور: SyriaCharity2026!
 * 4. 3 محاولات خاطئة = قفل 5 دقائق
 */
export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLockedOut, isAuthenticated } = useApp();

  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lockoutTime, setLockoutTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const kPresses = useRef([]);
  const passwordInputRef = useRef(null);

  // إذا كان مسجلاً الدخول بالفعل → وجهه للوحة التحكم
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/control-panel/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // عدّاد القفل
  useEffect(() => {
    const interval = setInterval(() => {
      const lockSeconds = isLockedOut();
      if (lockSeconds > 0) {
        setLockoutTime(lockSeconds);
      } else {
        setLockoutTime(0);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isLockedOut, showLogin]);

  // مراقبة الضغط على K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showLogin) return;
      if (e.key === "k" || e.key === "K") {
        const now = Date.now();
        kPresses.current.push(now);
        // مسح الضغطات القديمة (أكثر من ثانيتين)
        kPresses.current = kPresses.current.filter((t) => now - t < 2000);
        if (kPresses.current.length >= 3) {
          setShowLogin(true);
          kPresses.current = [];
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showLogin]);

  // Focus على حقل كلمة المرور عند ظهور صفحة Login
  useEffect(() => {
    if (showLogin && passwordInputRef.current) {
      setTimeout(() => passwordInputRef.current?.focus(), 400);
    }
  }, [showLogin]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (lockoutTime > 0) return;
      setLoading(true);
      setError("");

      // تأخير بسيط لمحاكاة الشبكة
      setTimeout(() => {
        const result = login(password);
        setLoading(false);

        if (result.success) {
          navigate("/control-panel/dashboard", { replace: true });
        } else if (result.locked) {
          setError(
            `تم قفل الحساب لمدة ${Math.ceil(result.secondsLeft / 60)} دقائق`,
          );
          setLockoutTime(result.secondsLeft);
        } else {
          setError(
            `كلمة المرور غير صحيحة. متبقي ${result.attemptsLeft} محاولات`,
          );
        }
      }, 500);
    },
    [password, login, navigate, lockoutTime],
  );

  return (
    <div className={styles.page}>
      {/* صفحة 404 المزيفة */}
      {!showLogin && (
        <div className={styles.notFound}>
          <div className={styles.notFoundContent}>
            <div className={styles.errorCode}>404</div>
            <h2>الصفحة غير موجودة</h2>
            <p>عذراً، الصفحة التي تبحث عنها غير موجودة.</p>
            <a href="/" className={styles.homeLink}>
              العودة للرئيسية
            </a>
          </div>
        </div>
      )}

      {/* صفحة تسجيل الدخول */}
      {showLogin && (
        <div className={styles.loginWrapper}>
          <div className={styles.loginBox}>
            <div className={styles.loginIcon}>
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2>لوحة التحكم</h2>
            <p>أدخل كلمة المرور للوصول</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label htmlFor="password">كلمة المرور</label>
                <div className={styles.inputWrap}>
                  <input
                    ref={passwordInputRef}
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••••••"
                    disabled={lockoutTime > 0}
                    autoComplete="current-password"
                  />
                  <i className="fa-solid fa-key"></i>
                </div>
              </div>

              {error && (
                <div className={styles.errorMsg}>
                  <i className="fa-solid fa-circle-exclamation"></i> {error}
                </div>
              )}

              {lockoutTime > 0 && (
                <div className={styles.lockoutMsg}>
                  <i className="fa-solid fa-clock"></i>
                  مدة القفل المتبقية: {Math.floor(lockoutTime / 60)}:
                  {String(lockoutTime % 60).padStart(2, "0")}
                </div>
              )}

              <button
                type="submit"
                className={styles.loginBtn}
                disabled={lockoutTime > 0 || loading}
              >
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-right-to-bracket"></i> دخول
                  </>
                )}
              </button>
            </form>

            <a href="/" className={styles.backLink}>
              ← العودة للصفحة الرئيسية
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
