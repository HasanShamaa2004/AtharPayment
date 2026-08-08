import { useState, useCallback } from "react";

/**
 * Hook مخصص للقراءة والكتابة من/إلى sessionStorage
 * أكثر أماناً من localStorage لأن البيانات تُمسح عند انتهاء الجلسة
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const storage = window.sessionStorage;
      const item = storage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        if (typeof window === "undefined") return;
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error("sessionStorage write error:", error);
      }
    },
    [key, storedValue],
  );

  const removeValue = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      window.sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("sessionStorage remove error:", error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
