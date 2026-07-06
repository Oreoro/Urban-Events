/* eslint-disable lingui/no-unlocalized-strings */
import classNames from "classnames";
import {getConfig} from "../../../utilites/config.ts";
import classes from "./BrandWordmark.module.scss";

interface BrandWordmarkProps {
    tone?: "light" | "dark";
    size?: "sm" | "md" | "lg";
    className?: string;
    onClick?: () => void;
}

export const BrandWordmark = ({
    tone = "dark",
    size = "md",
    className,
    onClick,
}: BrandWordmarkProps) => {
    const appName = getConfig("VITE_APP_NAME", "Urban Events") || "Urban Events";
    const displayName = appName.replace(/\s+/g, " ").trim();

    return (
        <span
            className={classNames(classes.wordmark, classes[tone], classes[size], className)}
            aria-label={appName}
            onClick={onClick}
        >
            <span className={classes.wordmarkText}>
                {displayName}
            </span>
        </span>
    );
};

export default BrandWordmark;
