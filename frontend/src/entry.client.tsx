import {createRoot, hydrateRoot} from "react-dom/client";
import {createBrowserRouter, matchRoutes} from "react-router";
import {RouterProvider} from "react-router/dom";

import {router} from "./router";
import {App} from "./App";
import {queryClient} from "./utilites/queryClient";
import {dynamicActivateLocale, getClientLocale, getSupportedLocale,} from "./locales.ts";

declare global {
    interface Window {
        __REHYDRATED_STATE__?: unknown;
    }
}

const dehydratedState = window.__REHYDRATED_STATE__;

async function initClientApp() {
    const rawLocale = getClientLocale();
    const locale = getSupportedLocale(rawLocale);
    await dynamicActivateLocale(locale);

    // Resolve lazy-loaded routes before hydration
    const matches = matchRoutes(router, window.location)?.filter((m) => m.route.lazy);
    if (matches && matches.length > 0) {
        await Promise.all(
            matches.map(async (m) => {
                const lazyRoute = m.route.lazy;
                if (typeof lazyRoute !== 'function') {
                    return;
                }
                const routeModule = await lazyRoute();
                Object.assign(m.route, {...routeModule, lazy: undefined});
            })
        );
    }

    const browserRouter = createBrowserRouter(router);

    const appElement = document.getElementById("app") as HTMLElement;
    const app = (
        <App queryClient={queryClient} locale={rawLocale} dehydratedState={dehydratedState}>
            <RouterProvider router={browserRouter}/>
        </App>
    );

    // The CSR template contains an <!--app-html--> placeholder comment, so
    // hasChildNodes() cannot distinguish it from real server-rendered markup.
    if (appElement.childElementCount > 0) {
        hydrateRoot(appElement, app);
    } else {
        createRoot(appElement).render(app);
    }
}

initClientApp();
