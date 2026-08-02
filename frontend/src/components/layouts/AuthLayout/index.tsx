import {Navigate, NavLink, Outlet} from "react-router";
import classes from "./Auth.module.scss";
import {t} from "@lingui/macro";
import {useGetMe} from "../../../queries/useGetMe.ts";
import {PoweredByFooter} from "../../common/PoweredByFooter";
import {LanguageSwitcher} from "../../common/LanguageSwitcher";
import {isHiEvents} from "../../../utilites/helpers.ts";
import {BrandWordmark} from "../../common/BrandWordmark";

const AuthLayout = () => {
    const me = useGetMe();

    if (me.isSuccess) {
        return <Navigate to={'/manage/events'} />
    }

    return (
        <div className={classes.authLayout}>
            <div className={classes.splitLayout}>
                <div className={classes.leftPanel}>
                    <main className={classes.container}>
                        <NavLink
                            to="/auth/login"
                            className={classes.logo}
                            aria-label={t`Urban Events login`}
                        >
                            <BrandWordmark tone="dark" size="lg"/>
                        </NavLink>
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
