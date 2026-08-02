import React from "react";
import {NavLink} from "react-router";
import {Breadcrumbs, Burger} from '@mantine/core';
import classes from './Topbar.module.scss';
import {BreadcrumbItem} from "../types";
import {GlobalMenu} from "../../../common/GlobalMenu";
import {BrandWordmark} from "../../../common/BrandWordmark";
import {t} from "@lingui/macro";

interface TopbarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    topBarShadow: boolean;
    breadcrumbItems: BreadcrumbItem[];
    topBarContent?: React.ReactNode;
    breadcrumbContentRight?: React.ReactNode;
    actionGroupContent?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({
                                                  sidebarOpen,
                                                  setSidebarOpen,
                                                  topBarShadow,
                                                  breadcrumbItems,
                                                  topBarContent = null,
                                                  breadcrumbContentRight = null,
                                                  actionGroupContent = null,
                                              }) => {
    return (
        <header className={`${classes.topBar} ${topBarShadow ? classes.withShadow : ''}`}>
            <div className={classes.topBarMain}>
                <div className={classes.burger}>
                    <Burger
                        color={'var(--hi-text)'}
                        opened={sidebarOpen}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        size={'sm'}
                        aria-label={sidebarOpen ? t`Close navigation` : t`Open navigation`}
                        aria-controls="app-sidebar"
                    />
                </div>
                <div className={classes.logo}>
                    <NavLink to={ `/manage/events` }>
                        <BrandWordmark tone="dark" size="sm"/>
                    </NavLink>
                </div>

                {topBarContent}
                <div className={classes.actionGroup}>
                    {actionGroupContent}

                    <div className={classes.menu}>
                        <GlobalMenu/>
                    </div>
                </div>
            </div>

            <div className={classes.breadcrumbsRow}>
                <div className={classes.breadcrumbs}>
                    <Breadcrumbs separator={<span className={classes.breadcrumbSeparator}>/</span>}>
                        {breadcrumbItems.map((item, index) => item.link ? (
                            <NavLink key={index} to={item.link}>
                                {item.content}
                            </NavLink>
                        ) : (
                            <span
                                key={index}
                                className={classes.breadcrumbCurrent}
                                aria-current={index === breadcrumbItems.length - 1 ? 'page' : undefined}
                            >
                                {item.content}
                            </span>
                        ))}
                    </Breadcrumbs>
                </div>
                {breadcrumbContentRight && (
                    <div className={classes.breadcrumbContentRight}>
                        {breadcrumbContentRight}
                    </div>
                )}
            </div>
        </header>
    );
};
