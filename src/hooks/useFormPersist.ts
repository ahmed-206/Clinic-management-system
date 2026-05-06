import { useEffect, useRef, useState } from 'react';
import type { UseFormReturn, FieldValues } from 'react-hook-form';

const DEBOUNCE_MS = 500;

export function useFormPersist<T extends FieldValues>(
  formKey: string,
  form: UseFormReturn<T>
) {
  const { watch, reset } = form;
  const resetRef = useRef(reset);
  const [isRestored, setIsRestored] = useState(false);

  // ✅ حافظ على آخر نسخة من reset بدون إعادة تشغيل الـ effect
  useEffect(() => {
    resetRef.current = reset;
  }, [reset]);

  // ✅ restore عند الـ mount — formKey بس في الـ dependency
  useEffect(() => {
    const savedData = sessionStorage.getItem(formKey);
    if (!savedData) return;

    try {
      const parsed = JSON.parse(savedData);
      if (parsed && Object.keys(parsed).length > 0) {
        resetRef.current((formValues) => ({ ...formValues, ...parsed }));
        setIsRestored(true);
      }
    } catch (e) {
      console.warn(`[useFormPersist] parse error for "${formKey}":`, e);
    }
  }, [formKey]);

  // ✅ save مع debounce — مش مع كل keystroke
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const subscription = watch((value) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        try {
          sessionStorage.setItem(formKey, JSON.stringify(value));
        } catch (e) {
          console.warn(`[useFormPersist] write error for "${formKey}":`, e);
        }
      }, DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [watch, formKey]);

  const clearPersistedForm = () => {
    sessionStorage.removeItem(formKey);
    setIsRestored(false);
  };

  return { clearPersistedForm, isRestored };
}