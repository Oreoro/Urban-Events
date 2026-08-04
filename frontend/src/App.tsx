import React, {FC, PropsWithChildren, useCallback, useEffect} from "react";
import {MantineProvider, v8CssVariablesResolver} from "@mantine/core";
import {Notifications} from "@mantine/notifications";
import {i18n} from "@lingui/core";
import {I18nProvider} from "@lingui/react";
import {ModalsProvider} from "@mantine/modals";
import {DatesProvider} from "@mantine/dates";
import {HydrationBoundary, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Helmet, HelmetProvider} from "react-helmet-async";

import "@mantine/core/styles/global.css";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/dropzone/styles.css";
import '@mantine/dates/styles.css';
import "@mantine/charts/styles.css";
import "./styles/global.scss";
import {isSsr} from "./utilites/helpers.ts";
import {StartupChecks} from "./StartupChecks.tsx";
import {ThirdPartyScripts} from "./components/common/ThirdPartyScripts";
import {getConfig} from "./utilites/config.ts";
import {CookieConsentBanner} from "./components/common/CookieConsentBanner";
import {isConsentPending, setConsentState, updateGoogleConsentMode} from "./utilites/trackingPixels/consent";
import "./utilites/dateLocales.ts";
import {getUrbanEventsTheme} from "./theme.ts";

declare global {
    interface Window {
        hievents: Record<string, string>;
        chatwootSDK?: {
            run: (options: { websiteToken: string; baseUrl: string }) => void;
        };
        $chatwoot?: {
            setUser: (id: string, attributes: Record<string, unknown>) => void;
            setCustomAttributes: (attributes: Record<string, unknown>) => void;
        };
    }
}

export const App: FC<
    PropsWithChildren<{
        queryClient: QueryClient;
        locale: string;
        helmetContext?: any;
        dehydratedState?: unknown;
    }>
> = (props) => {
    const appName = getConfig("VITE_APP_NAME", "Urban Events");
    const appDescription = "Publish event pages, sell tickets in PKR, and check in guests.";
    const appUrl = "https://app.urbanevents.pk";
    const previewImage = `${appUrl}/social-preview.png`;
    const [isLoadedOnBrowser, setIsLoadedOnBrowser] = React.useState(false);
    const showGlobalConsentBanner = getConfig('VITE_COOKIE_CONSENT_ENABLED') === 'true'
        && !isSsr() && isConsentPending();

    const handleGlobalConsent = useCallback((granted: boolean) => {
        setConsentState(granted ? 'granted' : 'denied');
        updateGoogleConsentMode(granted);
        window.dispatchEvent(new CustomEvent('hi_consent_change', {detail: {granted}}));
    }, []);

    useEffect(() => {
        setIsLoadedOnBrowser(!isSsr());
    }, []);

    return (
        <React.StrictMode>
            <div
                className="ssr-loader"
                style={{
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    margin: 0,
                    padding: 0,
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    background: "#ffffff",
                    zIndex: 1000,
                    display: isLoadedOnBrowser ? "none" : "block",
                }}
            />
            <MantineProvider
                cssVariablesResolver={v8CssVariablesResolver}
                theme={getUrbanEventsTheme()}
            >
                <HelmetProvider context={props.helmetContext}>
                    <I18nProvider i18n={i18n}>
                        <DatesProvider settings={{locale: props.locale}}>
                        <QueryClientProvider client={props.queryClient}>
                            <HydrationBoundary state={props.dehydratedState}>
                                <StartupChecks/>
                                <ThirdPartyScripts/>
                                <ModalsProvider>
                                    <Helmet>
                                        <title>{appName}</title>
                                        <meta name="description" content={appDescription}/>
                                        <meta name="application-name" content={appName}/>
                                        <meta name="theme-color" content="#171717"/>
                                        <meta property="og:site_name" content={appName}/>
                                        <meta property="og:title" content={`${appName} — Ticketing for Pakistan`}/>
                                        <meta property="og:description" content={appDescription}/>
                                        <meta property="og:type" content="website"/>
                                        <meta property="og:url" content={appUrl}/>
                                        <meta property="og:image" content={previewImage}/>
                                        <meta property="og:image:width" content="1200"/>
                                        <meta property="og:image:height" content="630"/>
                                        <meta property="og:image:alt" content="Urban Events — Publish, sell, and check in"/>
                                        <meta name="twitter:card" content="summary_large_image"/>
                                        <meta name="twitter:title" content={`${appName} — Ticketing for Pakistan`}/>
                                        <meta name="twitter:description" content={appDescription}/>
                                        <meta name="twitter:image" content={previewImage}/>
                                        <meta name="twitter:image:alt" content="Urban Events — Publish, sell, and check in"/>
                                        <link rel="icon"
                                              type="image/svg+xml"
                                              href={getConfig("VITE_APP_FAVICON", "/manifest-icons/favicon.svg")}
                                        />
                                        <link rel="apple-touch-icon" sizes="180x180" href="/manifest-icons/apple-touch-icon.png"/>
                                        <link rel="manifest" href="/site.webmanifest"/>
                                    </Helmet>
                                    {props.children}
                                </ModalsProvider>
                                <Notifications pauseResetOnHover="notification"/>
                                {showGlobalConsentBanner && (
                                    <CookieConsentBanner onConsent={handleGlobalConsent}/>
                                )}
                            </HydrationBoundary>
                        </QueryClientProvider>
                        </DatesProvider>
                    </I18nProvider>
                </HelmetProvider>
            </MantineProvider>
        </React.StrictMode>
    );
};
