import {getConfig} from "./config.ts";

const URBAN_EVENTS_HOME = "https://urbanevents.pk";

const normalizeLegalUrl = (url: string | undefined, fallbackPath: string): string => {
    if (!url) {
        return `${URBAN_EVENTS_HOME}${fallbackPath}`;
    }

    try {
        const parsed = new URL(url);
        const isUrbanHome = parsed.hostname.replace(/^www\./, '') === 'urbanevents.pk'
            && (parsed.pathname === '/' || parsed.pathname === '');

        if (isUrbanHome) {
            return `${URBAN_EVENTS_HOME}${fallbackPath}`;
        }
    } catch {
        return `${URBAN_EVENTS_HOME}${fallbackPath}`;
    }

    return url;
};

export const getTermsUrl = (): string => normalizeLegalUrl(
    getConfig('VITE_TOS_URL', `${URBAN_EVENTS_HOME}/terms-of-service`),
    '/terms-of-service',
);

export const getPrivacyUrl = (): string => normalizeLegalUrl(
    getConfig('VITE_PRIVACY_URL', `${URBAN_EVENTS_HOME}/privacy-policy`),
    '/privacy-policy',
);
