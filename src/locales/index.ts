/**
 * Locale registry — the single place to register available languages.
 *
 * To add a new language:
 *   1. Create src/locales/xx.ts exporting a TranslationDict as default
 *   2. Import it below and add one entry to the LOCALES array
 *   3. The settings dropdown will pick it up automatically (no other code change)
 */
import type { TranslationDict } from '../i18n';
import zh from './zh';
import en from './en';

/** Metadata for a registered locale */
export interface LocaleInfo {
	/** Language code used in settings (e.g. 'zh', 'en') */
	code: string;
	/** Display name shown in the settings dropdown (native name) */
	label: string;
	/** Short flag emoji for display */
	flag: string;
	/** The translation dictionary itself */
	dict: TranslationDict;
}

/** All available locales. Order here controls the order in the settings dropdown. */
export const LOCALES: LocaleInfo[] = [
	{ code: 'zh', label: '简体中文', flag: '🇨🇳', dict: zh },
	{ code: 'en', label: 'English', flag: '🇬🇧', dict: en },
];

/** Look up locale info by code */
export function getLocaleInfo(code: string): LocaleInfo | undefined {
	return LOCALES.find((l) => l.code === code);
}

/** Language codes of all available locales (excluding 'auto') */
export function getLocaleCodes(): string[] {
	return LOCALES.map((l) => l.code);
}
