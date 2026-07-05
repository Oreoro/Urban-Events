import {useGetMe} from "./queries/useGetMe.ts";
import {useEffect} from "react";
import {dynamicActivateLocale, getClientLocale} from "./locales.ts";
import {isSsr} from "./utilites/helpers.ts";

const PUBLIC_AUTH_PROBE_PATHS = [
    '/auth',
    '/events/',
    '/event/',
    '/checkout',
    '/widget',
    '/product/',
    '/order/',
    '/my-tickets',
    '/check-in',
];

const shouldRunUserStartupChecks = () => {
    if (isSsr()) {
        return false;
    }

    return !PUBLIC_AUTH_PROBE_PATHS.some(path => window.location.pathname.startsWith(path));
};

export const StartupChecks = () => {
    const meQuery = useGetMe({enabled: shouldRunUserStartupChecks()});

    const setLocaleForLoggedInUser = () => {
        const cookieLocale = getClientLocale();

        if (cookieLocale) {
            // If the user has a locale set in their cookies, we don't want to override it
            return;
        }

        if (meQuery.data?.locale) {
            dynamicActivateLocale(meQuery.data.locale).then(() => {
                console.log('Activated locale from user settings ' + meQuery.data.locale);
            });
        }
    };

    useEffect(() => {
        if (!meQuery.isSuccess) {
            return;
        }

        setLocaleForLoggedInUser();
    }, [meQuery.isSuccess]);

    return <></>;
}
