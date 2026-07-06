import React from "react";
import classes from './NoResultsSplash.module.scss';
import {useSearchParams} from "react-router";
import {t} from "@lingui/macro";
import {IconInbox} from "@tabler/icons-react";

interface NoResultsSplashProps {
    heading?: React.ReactNode,
    children?: React.ReactNode,
    subHeading?: React.ReactNode,
    imageHref?: string,
    icon?: React.ReactNode,
    compact?: boolean,
}

export const NoResultsSplash = ({
                                    heading = t`There's nothing to show yet`,
                                    children,
                                    subHeading,
                                    imageHref,
                                    icon,
                                    compact = false,
                                }: NoResultsSplashProps) => {
    const [searchParams] = useSearchParams();
    const hasSearchQuery = !!searchParams.get('query');

    return (
        <div className={`${classes.container} ${compact ? classes.compact : ''}`}>
            <div className={classes.visual} aria-hidden="true">
                {icon ? (
                    <span className={classes.icon}>{icon}</span>
                ) : imageHref ? (
                    <img alt="" width={300} src={imageHref}/>
                ) : (
                    <IconInbox size={22} stroke={1.7}/>
                )}
            </div>

            {heading && !hasSearchQuery && <h2>{heading}</h2>}

            {hasSearchQuery && (
                <h2>{t`No search results.`}</h2>
            )}

            {(subHeading && !hasSearchQuery) && subHeading}

            {children && children}
        </div>
    )
}
