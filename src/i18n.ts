/**
 * i18n module for Custom Sort plugin
 * Lightweight translation system with language auto-detection.
 *
 * Translation dictionaries live in src/locales/ — one file per language.
 * To add a language, create src/locales/xx.ts and register it in
 * src/locales/index.ts (see LOCALES array). The settings dropdown
 * picks it up automatically.
 *
 * Usage:
 *   import { t, setLanguage, getLanguage } from './i18n';
 *   t('settings.delayName') // => "初始自动应用自定义排序的延迟"
 *   t('err.dupSortSpec', { path: 'Notes' }) // => "文件夹 Notes 的排序规格重复"
 */

import { LOCALES, getLocaleInfo, getLocaleCodes } from './locales';

/** Language codes supported by the plugin ('auto' = follow Obsidian locale) */
export type LanguageCode = 'auto' | string;

/** A translation dictionary: key -> template */
export type TranslationDict = {
	[key: string]: string | TranslationDict;
};

/** A concrete (resolved) language code that has a registered dictionary */
export type ResolvedLanguage = string;

/** Translation function signature (injectable for testing) */
export type Translator = (key: string, params?: Record<string, string | number | undefined>) => string;

let currentLanguage: ResolvedLanguage = 'zh';
let fallbackLanguage: ResolvedLanguage = 'en';

/** Resolve 'auto' to an actual language based on Obsidian's locale */
export function resolveLanguage(lang: LanguageCode): ResolvedLanguage {
	if (lang === 'auto') {
		// Detect from Obsidian's moment locale (e.g. 'zh-cn', 'en', 'de')
		try {
			const locale = (window as any).moment?.locale?.() ?? 'en';
			const lower = String(locale).toLowerCase();
			const codes = getLocaleCodes();
			// 1. Exact match on the full locale string ('en', 'zh-cn' if registered)
			if (codes.includes(lower)) return lower;
			// 2. Longest-prefix match: 'zh-cn' -> 'zh', 'pt-br' -> 'pt'
			//    Sort by code length desc so 'pt-br' beats 'pt' when both are registered
			const matches = codes
				.filter((code) => lower.startsWith(code + '-') || lower.startsWith(code + '_'))
				.sort((a, b) => b.length - a.length);
			if (matches.length > 0) return matches[0];
			// 3. Fallback: first 2 letters
			const prefix = lower.slice(0, 2);
			if (codes.includes(prefix)) return prefix;
			return fallbackLanguage;
		} catch {
			return fallbackLanguage;
		}
	}
	// Manual selection — only accept codes that have a registered dictionary
	return getLocaleInfo(lang) ? lang : fallbackLanguage;
}

/** Set the current language (auto resolves immediately) */
export function setLanguage(lang: LanguageCode): void {
	currentLanguage = resolveLanguage(lang);
}

/** Get the current resolved language */
export function getLanguage(): ResolvedLanguage {
	return currentLanguage;
}

/** Get all available locale codes (excluding 'auto'), in registry order */
export function getAvailableLanguageCodes(): string[] {
	return getLocaleCodes();
}

/** Get all available locales with metadata (for settings dropdown) */
export function getAvailableLocales() {
	return LOCALES.map(({ code, label, flag }) => ({ code, label, flag }));
}

/** Look up a key in a dictionary, supporting both flat keys and dot-path traversal */
function lookup(dict: TranslationDict, key: string): string | undefined {
	// Try the full key first (flat keys like 'err.specProblem')
	const direct = dict[key];
	if (typeof direct === 'string') {
		return direct;
	}
	// Fall back to dot-path traversal (nested keys)
	const parts = key.split('.');
	let node: TranslationDict = dict;
	for (const part of parts) {
		const next = node[part];
		if (typeof next === 'string') {
			return next;
		}
		if (next && typeof next === 'object') {
			node = next as TranslationDict;
		} else {
			return undefined;
		}
	}
	return undefined;
}

/** Convenience: translate a string from the given dict directly (for tests) */
export function translate(dict: TranslationDict, key: string, params?: Record<string, string | number | undefined>): string {
	let template = lookup(dict, key) ?? key;
	if (params) {
		for (const k in params) {
			template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
		}
	}
	return template;
}

/** Internal: translate using the given dict with fallback to the other dicts */
function tFromDict(dict: TranslationDict, key: string, params?: Record<string, string | number | undefined>): string {
	let template = lookup(dict, key);
	if (template === undefined) {
		// Fallback: try the fallback language, then any registered dict
		const fallback = getLocaleInfo(fallbackLanguage)?.dict;
		if (fallback) {
			template = lookup(fallback, key);
		}
		if (template === undefined) {
			for (const locale of LOCALES) {
				if (locale.code === currentLanguage || locale.code === fallbackLanguage) continue;
				template = lookup(locale.dict, key);
				if (template !== undefined) break;
			}
		}
	}
	if (template === undefined) {
		return key; // Not found — return the key itself
	}
	if (params) {
		for (const k in params) {
			template = template.replace(new RegExp(`\\{${k}\\}`, 'g'), String(params[k]));
		}
	}
	return template;
}

/**
 * Translate a key with optional parameters.
 * Supports both flat keys ('settings.delayName') and nested templates.
 * Parameters use {name} placeholders.
 */
export function t(key: string, params?: Record<string, string | number | undefined>): string {
	const dict = getLocaleInfo(currentLanguage)?.dict;
	if (!dict) {
		// Current language not registered (shouldn't happen) — fall back
		const fallback = getLocaleInfo(fallbackLanguage)?.dict;
		if (fallback) return tFromDict(fallback, key, params);
		return key;
	}
	return tFromDict(dict, key, params);
}
