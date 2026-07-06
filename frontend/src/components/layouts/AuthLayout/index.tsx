import {Navigate, Outlet} from "react-router";
import classes from "./Auth.module.scss";
import {t} from "@lingui/macro";
import {useGetMe} from "../../../queries/useGetMe.ts";
import {PoweredByFooter} from "../../common/PoweredByFooter";
import {LanguageSwitcher} from "../../common/LanguageSwitcher";
import {useCallback, useRef} from "react";
import {isHiEvents} from "../../../utilites/helpers.ts";
import {showInfo} from "../../../utilites/notifications.tsx";
import {BrandWordmark} from "../../common/BrandWordmark";
import {getConfig} from "../../../utilites/config.ts";

const AuthLayout = () => {
    const me = useGetMe();
    const clickCountRef = useRef(0);
    const clickTimerRef = useRef<ReturnType<typeof setTimeout>>();

    const handleLogoClick = useCallback(() => {
        clickCountRef.current += 1;
        clearTimeout(clickTimerRef.current);
        clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 2000);

        if (clickCountRef.current >= 5) {
            clickCountRef.current = 0;
            const appName = getConfig("VITE_APP_NAME", "Urban Events") || "Urban Events";
            showInfo(`${appName} v${__APP_VERSION__}`);
        }
    }, []);

    if (me.data) {
        return <Navigate to={'/manage/events'} />
    }

    return (
        <div className={classes.authLayout}>
            <div className={classes.splitLayout}>
                <div className={classes.leftPanel}>
                    <main className={classes.container}>
                        <button
                            type="button"
                            className={classes.logoButton}
                            onClick={handleLogoClick}
                            aria-label={t`Show application version`}
                        >
                            <BrandWordmark tone="dark" size="md"/>
                        </button>
                        <div className={classes.wrapper}>
                            <Outlet />
                            {/*
                             * (c) Hi.Events Ltd 2025
                             *
                             * PLEASE NOTE:
                             *
                             * Hi.Events is licensed under the GNU Affero General Public License (AGPL) version 3.
                             *
                             * You can find the full license text at: https://github.com/HiEventsDev/hi.events/blob/main/LICENCE
                             *
                             * In accordance with Section 7(b) of the AGPL, we ask that you retain the "Powered by Hi.Events" notice.
                             *
                             * If you wish to remove this notice, a commercial license is available at: https://hi.events/licensing
                             */}
                            {!isHiEvents() && <PoweredByFooter />}
                            <div className={classes.languageSwitcher}>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
