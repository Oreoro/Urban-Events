import {i18n, type MessageDescriptor} from "@lingui/core";
import {msg} from "@lingui/macro";

export type SupportedLocales =
    "en"
    | "de"
    | "fr"
    | "it"
    | "nl"
    | "pt"
    | "es"
    | "zh-cn"
    | "pt-br"
    | "vi"
    | "zh-hk"
    | "tr"
    | "hu"
    | "pl"
    | "se"
    | "sk"
    | "el";

export const availableLocales = ["en", "de", "fr", "it", "nl", "pt", "es", "zh-cn", "zh-hk", "pt-br", "vi", "tr", "hu", "pl", "se", "sk", "el"];

export const localeToFlagEmojiMap: Record<SupportedLocales, string> = {
    en: '🇬🇧',
    de: '🇩🇪',
    fr: '🇫🇷',
    it: '🇮🇹',
    nl: '🇳🇱',
    pt: '🇵🇹',
    es: '🇪🇸',
    "zh-cn": '🇨🇳',
    "zh-hk": '🇭🇰',
    "pt-br": '🇧🇷',
    vi: '🇻🇳',
    tr: '🇹🇷',
    hu: '🇭🇺',
    pl: '🇵🇱',
    se: '🇸🇪',
    sk: '🇸🇰',
    el: '🇬🇷',
};

export const localeToNameMap: Record<SupportedLocales, MessageDescriptor> = {
    en: msg`English`,
    de: msg`German`,
    fr: msg`French`,
    it: msg`Italian`,
    nl: msg`Dutch`,
    pt: msg`Portuguese`,
    es: msg`Spanish`,
    "zh-cn": msg`Chinese (Simplified)`,
    "zh-hk": msg`Chinese (Traditional)`,
    "pt-br": msg`Brazilian Portuguese`,
    vi: msg`Vietnamese`,
    tr: msg`Turkish`,
    hu: msg`Hungarian`,
    pl: msg`Polish`,
    se: msg`Swedish`,
    sk: msg`Slovak`,
    el: msg`Greek`,
};

export const getLocaleName = (locale: SupportedLocales) => {
    return i18n._(localeToNameMap[locale]);
}

export const getClientLocale = () => {
    if (typeof window !== "undefined") {
        const storedLocale = document
            .cookie
            .split(";")
            .find((c) => c.includes("locale="))
            ?.split("=")[1];

        if (storedLocale) {
            return getSupportedLocale(storedLocale);
        }

        return getSupportedLocale(window.navigator.language);
    }

    return "en";
};

export async function dynamicActivateLocale(locale: string) {
    try {
        locale = availableLocales.includes(locale) ? locale : "en";
        const module = (await import(`./locales/${locale}.po`));
        i18n.load(locale, module.messages);
        i18n.activate(locale);
    } catch (error) {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        console.error("Error loading locale:", error);
        // i18n.activate("en");
    }
}

export const getSupportedLocale = (userLocale: string) => {
    const normalizedLocale = userLocale.toLowerCase();

    if (availableLocales.includes(normalizedLocale)) {
        return normalizedLocale;
    }

    const mainLanguage = normalizedLocale.split('-')[0];
    const mainLocale = availableLocales.find(locale => locale.startsWith(mainLanguage));
    if (mainLocale) {
        return mainLocale;
    }

    return "en";
};
