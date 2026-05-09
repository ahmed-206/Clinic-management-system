import { useTranslation } from 'react-i18next';
import type { MedicalSpecialty } from '../../constants/medicalSpecialties';

export const useSpecialtyTranslation = () => {
  const { t } = useTranslation('common');

  // ✅ يترجم الـ key للغة الحالية
  const translateSpecialty = (key: MedicalSpecialty | string): string => {
    return t(`specialties.${key}` as never, { defaultValue: key });
  };

  return { translateSpecialty };
};