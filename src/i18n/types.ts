
import type { EnResources } from './locales/en';

//  1. كل namespace كـ type مستقل
export type FormNS    = EnResources['form'];
export type CommonNS  = EnResources['common'];
export type NavNS     = EnResources['nav'];
export type LandingNS = EnResources['landing'];

//  2. Dot notation utility — يحول الـ JSON لـ "a.b.c" keys
type DotNotation<T, P extends string = ''> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? DotNotation<T[K], `${P}${K & string}.`>
    : `${P}${K & string}`;
}[keyof T];

//  3. Keys لكل namespace
export type FormKeys    = DotNotation<FormNS>;
export type CommonKeys  = DotNotation<CommonNS>;
export type NavKeys     = DotNotation<NavNS>;
export type LandingKeys = DotNotation<LandingNS>;

//  4. Union type — لو محتاج تستخدم أي key من أي namespace
export type AllTranslationKeys =
  | FormKeys
  | CommonKeys
  | NavKeys
  | LandingKeys;

//  5. augment i18next — بيديه الـ autocomplete في useTranslation
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: EnResources;
  }
}