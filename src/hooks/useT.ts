
import { useTranslation } from 'react-i18next';
import type {
  FormKeys, CommonKeys, NavKeys, LandingKeys,DashboardKeys
} from '../i18n/types';

//  hook لكل namespace — autocomplete كامل
export const useFormT = () => {
  const { t } = useTranslation('form');
  return (key: FormKeys) => t(key);
};

export const useCommonT = () => {
  const { t } = useTranslation('common');
  return (key: CommonKeys) => t(key);
};

export const useNavT = () => {
  const { t } = useTranslation('nav');
  return (key: NavKeys) => t(key);
};

export const useLandingT = () => {
  const { t } = useTranslation('landing');
  return (key: LandingKeys) => t(key);
};
export const useDashboardT = () => {
  const { t } = useTranslation('dashboard');
  return (key: DashboardKeys) => t(key);
};