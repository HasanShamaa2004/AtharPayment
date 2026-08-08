import React, { createContext, useContext, useCallback, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../hooks/useAuth";
import { DEFAULT_PAYMENTS, DEFAULT_SETTINGS } from "../data/defaultData";
import { generateId } from "../utils/generateId";

const LEGACY_TEAM_NAME = "فريق الخير التطوعي";
const CURRENT_TEAM_NAME = "فريق أثر التطوعي";
const STORAGE_VERSION = 2;
const STORAGE_VERSION_KEY = "charity_app_version";

const isValidPaymentList = (list) =>
  Array.isArray(list) &&
  list.every((payment) => payment && typeof payment === "object");
const isValidSettings = (data) => data && typeof data === "object";

const AppContext = createContext(null);

/**
 * مزود حالة التطبيق الرئيسي
 * يدير: وسائل الدفع، الإعدادات، المصادقة، الإشعارات
 */
export function AppProvider({ children }) {
  const [payments, setPayments] = useLocalStorage(
    "charity_payment_methods",
    null,
  );
  const [settings, setSettings] = useLocalStorage(
    "charity_site_settings",
    null,
  );
  const auth = useAuth();

  const normalizePayments = useCallback((list) => {
    if (!Array.isArray(list)) return [];
    return list.filter((payment) => payment?.isActive !== false);
  }, []);

  const migratePayments = (list) =>
    list?.map((payment) =>
      payment.accountName === LEGACY_TEAM_NAME
        ? { ...payment, accountName: CURRENT_TEAM_NAME }
        : payment,
    );

  const migrateSettings = (data) =>
    data?.teamName === LEGACY_TEAM_NAME
      ? { ...data, teamName: CURRENT_TEAM_NAME }
      : data;

  // تهيئة البيانات الافتراضية إذا لم تكن موجودة
  const paymentMethods = normalizePayments(
    payments ? migratePayments(payments) : DEFAULT_PAYMENTS,
  );
  const siteSettings = settings ? migrateSettings(settings) : DEFAULT_SETTINGS;

  // إذا كانت البيانات فارغة أو قديمة، قم بتهيئتها أو ترحيلها
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const currentVersion = Number(
      window.sessionStorage.getItem(STORAGE_VERSION_KEY) || 0,
    );
    if (currentVersion !== STORAGE_VERSION) {
      setPayments(DEFAULT_PAYMENTS);
      setSettings(DEFAULT_SETTINGS);
      window.sessionStorage.setItem(
        STORAGE_VERSION_KEY,
        String(STORAGE_VERSION),
      );
      return;
    }

    if (!payments || !isValidPaymentList(payments)) {
      setPayments(DEFAULT_PAYMENTS);
    } else if (payments.some((p) => p.accountName === LEGACY_TEAM_NAME)) {
      setPayments(migratePayments(payments));
    }

    if (!settings || !isValidSettings(settings)) {
      setSettings(DEFAULT_SETTINGS);
    } else if (settings.teamName === LEGACY_TEAM_NAME) {
      setSettings(migrateSettings(settings));
    }
  }, [payments, settings, setPayments, setSettings]);

  // ===== إشعارات Toast =====
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  // ===== إدارة وسائل الدفع =====
  const addPayment = useCallback(
    (paymentData) => {
      const newPayment = {
        ...paymentData,
        id: generateId(),
        isActive: paymentData.isActive ?? true,
        createdAt: new Date().toISOString().slice(0, 10),
      };
      setPayments((prev) => [...(prev || []), newPayment]);
      addToast("تم إضافة وسيلة الدفع بنجاح", "success");
      return newPayment;
    },
    [setPayments, addToast],
  );

  const editPayment = useCallback(
    (id, paymentData) => {
      setPayments((prev) =>
        (prev || []).map((p) => (p.id === id ? { ...p, ...paymentData } : p)),
      );
      addToast("تم تعديل وسيلة الدفع بنجاح", "success");
    },
    [setPayments, addToast],
  );

  const deletePayment = useCallback(
    (id) => {
      setPayments((prev) => (prev || []).filter((p) => p.id !== id));
      addToast("تم حذف الوسيلة", "success");
    },
    [setPayments, addToast],
  );

  const togglePaymentStatus = useCallback(
    (id, isActive) => {
      setPayments((prev) =>
        (prev || []).map((payment) =>
          payment.id === id ? { ...payment, isActive } : payment,
        ),
      );
      addToast(
        isActive ? "تم إظهار وسيلة الدفع" : "تم إخفاء وسيلة الدفع",
        "info",
      );
    },
    [setPayments, addToast],
  );

  // ===== إدارة الإعدادات =====
  const updateSettings = useCallback(
    (newSettings) => {
      setSettings((prev) => ({ ...prev, ...newSettings }));
      addToast("تم حفظ الإعدادات بنجاح", "success");
    },
    [setSettings, addToast],
  );

  const value = {
    paymentMethods,
    siteSettings,
    addPayment,
    editPayment,
    deletePayment,
    togglePaymentStatus,
    updateSettings,
    toasts,
    addToast,
    ...auth,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
