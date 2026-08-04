import {Navigate, NavLink, Outlet} from "react-router";
import classes from "./Auth.module.scss";
import {t} from "@lingui/macro";
import {useGetMe} from "../../../queries/useGetMe.ts";
import {LanguageSwitcher} from "../../common/LanguageSwitcher";
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
