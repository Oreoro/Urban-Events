import React from "react";
import {Badge, FocusTrap, UnstyledButton, VisuallyHidden} from '@mantine/core';
import {IconChevronLeft} from "@tabler/icons-react";
import {t} from "@lingui/macro";
import classes from './Sidebar.module.scss';
import {NavItem} from "../types";
import {NavLink} from "react-router";
import classNames from "classnames";
import {useMediaQuery} from "@mantine/hooks";
import {BrandWordmark} from "../../../common/BrandWordmark";

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    navItems: NavItem[];
    sidebarFooter?: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
                                                    sidebarOpen,
                                                    setSidebarOpen,
                                                    navItems,
                                                    sidebarFooter,
                                                }) => {
    // eslint-disable-next-line lingui/no-unlocalized-strings
    const isMobile = useMediaQuery('(max-width: 767px)');

    const renderLinks = () => {
        return navItems.map((item) => {

            if (!item.link && item.link !== "" && item.onClick === undefined) {
                return (
                    <div className={classes.sectionHeading} key={item.label}>
                        {item.label}
                    </div>
                );
            }

            if (item.showWhen && !item.showWhen()) {
                return null;
            }

            if (item.loading) {
                return <div key={item.label} className={classNames(classes.loading, classes.link)} aria-hidden="true">&nbsp;</div>;
            }


            return (
                <NavLink
                    to={item.comingSoon ? '#' : (item.link ?? '#')}
                    key={item.label}
                    onClick={() => {
                        if (isMobile) {
                            setSidebarOpen(false);
                        }
                        if (item.onClick) item.onClick();
                    }}
                    className={({isActive}) =>
                        `${((item.isActive ? item.isActive(isActive) : isActive) && !item.comingSoon)
                            ? classes.linkActive
                            : ""} ${classes.link}`
                    }
                >
                    {item.icon && <item.icon size={18} className={classes.linkIcon} stroke={1.7}/>}
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                        <Badge
                            size="xs"
                            radius="xl"
                            className={item.badgeColor ? classes.navBadgeAlert : classes.navBadge}
                        >
                            {item.badge}
                        </Badge>
                    )}
                    {item.comingSoon &&
                        <Badge ml={'4px'} size={'xs'} className={classes.comingSoonBadge}>{t`Coming Soon`}</Badge>}
                </NavLink>
            );
        });
    };

    return (
        <FocusTrap active={Boolean(isMobile && sidebarOpen)}>
            <aside
                id="app-sidebar"
                className={classNames(`${classes.sidebar} ${sidebarOpen ? classes.open : classes.closed}`)}
                aria-label={t`Application navigation`}
                aria-hidden={isMobile && !sidebarOpen}
            >
                <div className={classes.logo}>
                    <NavLink to={`/manage/events`}>
                        <BrandWordmark tone="light" size="md"/>
                    </NavLink>
                </div>
                <nav className={classes.nav} aria-label={t`Primary navigation`}>
                    {renderLinks()}
                </nav>
                {sidebarFooter && (
                    <div className={classes.sidebarFooter}>
                        {sidebarFooter}
                    </div>
                )}
                {sidebarOpen && (
                    <UnstyledButton
                        className={classes.sidebarClose}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        aria-label={t`Close sidebar`}
                        aria-controls="app-sidebar"
                        aria-expanded={sidebarOpen}
                        data-autofocus
                    >
                        <IconChevronLeft size={20}/>
                        <VisuallyHidden>{t`Close sidebar`}</VisuallyHidden>
                    </UnstyledButton>
                )}
            </aside>
        </FocusTrap>
    );
};
