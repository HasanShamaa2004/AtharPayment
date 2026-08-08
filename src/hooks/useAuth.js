import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

const PASSWORD = 'SyriaCharity2026!';
const PASSWORD_HASH = btoa(PASSWORD);
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 دقائق
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 ساعة

/**
 * Hook مخصص لإدارة المصادقة والحماية
 * يوفر: login, logout, isAuthenticated, loginAttempts, isLockedOut
 */
export function useAuth() {
  const [token, setToken, removeToken] = useLocalStorage('charity_auth_token', null);
  const [loginAttempts, setLoginAttempts] = useLocalStorage('charity_login_attempts', 0);
  const [lockoutUntil, setLockoutUntil] = useLocalStorage('charity_lockout_until', 0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // التحقق من صحة الـ token عند التحميل
  useEffect(() => {
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        if (decoded.expiry && Date.now() < decoded.expiry) {
          setIsAuthenticated(true);
        } else {
          removeToken();
          setIsAuthenticated(false);
        }
      } catch {
        removeToken();
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [token, removeToken]);

  const isLockedOut = useCallback(() => {
    if (lockoutUntil && Date.now() < lockoutUntil) {
      return Math.ceil((lockoutUntil - Date.now()) / 1000);
    }
    if (lockoutUntil && Date.now() >= lockoutUntil) {
      setLoginAttempts(0);
      setLockoutUntil(0);
    }
    return 0;
  }, [lockoutUntil, setLoginAttempts, setLockoutUntil]);

  const login = useCallback(
    (password) => {
      const lockSeconds = isLockedOut();
      if (lockSeconds > 0) {
        return { success: false, locked: true, secondsLeft: lockSeconds };
      }

      if (atob(PASSWORD_HASH) === password.trim()) {
        // نجاح تسجيل الدخول
        const payload = btoa(JSON.stringify({
          user: 'admin',
          issued: Date.now(),
          expiry: Date.now() + TOKEN_EXPIRY,
        }));
        setToken(payload);
        setLoginAttempts(0);
        setLockoutUntil(0);
        setIsAuthenticated(true);
        return { success: true };
      }

      // فشل
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        setLockoutUntil(Date.now() + LOCKOUT_DURATION);
        setLoginAttempts(0);
        return { success: false, locked: true, secondsLeft: Math.ceil(LOCKOUT_DURATION / 1000) };
      }

      return { success: false, attemptsLeft: MAX_ATTEMPTS - newAttempts };
    },
    [loginAttempts, isLockedOut, setToken, setLoginAttempts, setLockoutUntil]
  );

  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);
    setLoginAttempts(0);
    setLockoutUntil(0);
  }, [removeToken, setLoginAttempts, setLockoutUntil]);

  return {
    isAuthenticated,
    login,
    logout,
    isLockedOut,
  };
}
