// useSessionStorage.ts
import { useState, useEffect } from 'react';

const DEBOUNCE_MS = 300;

export function useSessionStorage<T>(key: string, initialValue: T | (() => T)) {
  const getInitial = (): T => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) return JSON.parse(item);
    } catch (error) {
      console.warn(`[useSessionStorage] read error "${key}":`, error);
    }
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  };

  const [value, setValue] = useState<T>(getInitial);

  // ✅ لو الـ key اتغير — جيب القيمة الجديدة
  useEffect(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      if (item) setValue(JSON.parse(item));
    } catch (error) {
      console.warn(`[useSessionStorage] key change read error "${key}":`, error);
    }
  }, [key]);

  // ✅ write مع debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`[useSessionStorage] write error "${key}":`, error);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [key, value]);

  // ✅ clear function
  const clearValue = () => {
    try {
      window.sessionStorage.removeItem(key);
      setValue(
        typeof initialValue === 'function'
          ? (initialValue as () => T)()
          : initialValue
      );
    } catch (error) {
      console.warn(`[useSessionStorage] clear error "${key}":`, error);
    }
  };

  return [value, setValue, clearValue] as const;
}