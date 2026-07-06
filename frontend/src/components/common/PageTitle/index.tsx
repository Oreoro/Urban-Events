import React from "react";
import classes from './PageTitle.module.scss';

interface PageTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode,
    subheading?: string
}

export const PageTitle = (props: PageTitleProps) => {
    const { children, subheading, className, ...rest } = props;

    return (
        <div className={classes.container}>
            <h1 className={`${classes.title} ${className ?? ''}`} {...rest}>
                {children}
            </h1>
            {subheading && (
                <div className={classes.subheading}>
                    {subheading}
                </div>
            )}
        </div>
    );
}
