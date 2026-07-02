import { useState, useEffect } from "react";

const PREFIX = "meat-erp:";

/**
 * useState kabi, lekin qiymatni localStorage'da saqlaydi.
 * Sahifa qayta yuklansa yoki tok/internet uzilib qolsa ham ma'lumot yo'qolmaydi.
 */
export function usePersistedState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(PREFIX + key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(state));
    } catch {
      // Saqlash imkoni bo'lmasa (masalan xotira to'lgan), sokin o'tkazib yuboriladi
    }
  }, [key, state]);

  return [state, setState];
}
