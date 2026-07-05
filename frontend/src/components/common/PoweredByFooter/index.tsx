/* eslint-disable lingui/no-unlocalized-strings */
import {t} from "@lingui/macro";
import classes from "./FloatingPoweredBy.module.scss";
import classNames from "classnames";
import React from "react";
import {iHavePurchasedALicence} from "../../../utilites/helpers.ts";
import {getConfig} from "../../../utilites/config.ts";

/**
 * (c) Hi.Events Ltd 2025
 *
 * PLEASE NOTE:
 *
 * Hi.Events is licensed under the GNU Affero General Public License (AGPL) version 3.
 *
 * You can find the full license text at: https://github.com/HiEventsDev/hi.events/blob/main/LICENCE
 *
 * In accordance with Section 7(b) of the AGPL, you must retain the "Powered by Hi.Events" notice.
 *
 * If you wish to remove this notice, a commercial license is available at: https://hi.events/licensing
 */
export const PoweredByFooter = (
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) => {
    if (iHavePurchasedALicence()) {
        return <></>;
    }

    const appName = getConfig("VITE_APP_NAME", "Urban Events") || "Urban Events";
    const link = getConfig("VITE_FRONTEND_URL", "https://app.urbanevents.pk") || "https://app.urbanevents.pk";

    return (
        <div {...props} className={classNames(classes.poweredBy, props.className)}>
            <div className={classes.poweredByText}>
                {t`Powered by`}{" "}
                <a
                    href={link}
                    target="_blank"
                    title={appName}
                >
                    {appName}
                </a>
            </div>
        </div>
    );
}
