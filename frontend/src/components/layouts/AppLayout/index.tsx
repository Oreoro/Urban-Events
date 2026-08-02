import React, {useEffect, useRef, useState} from "react";
import {Outlet, useLocation} from "react-router";
import classes from './AppLayout.module.scss';
import {Topbar} from "./Topbar";
import {Sidebar} from "./Sidebar";
import {BreadcrumbItem, NavItem} from "./types.ts";
import {IconLayoutSidebar} from "@tabler/icons-react";
import {UnstyledButton, VisuallyHidden} from "@mantine/core";
import {t} from "@lingui/macro";
import ImpersonationBanner from "../../common/ImpersonationBanner";
import PendingDeletionBanner from "../../common/PendingDeletionBanner";
import AnnouncementDisplay from "../../common/AnnouncementDisplay";

interface AppLayoutProps {
    navItems: NavItem[];
    breadcrumbItems: BreadcrumbItem[];
    entityType: 'event' | 'organizer';
    topBarContent?: React.ReactNode;
    breadcrumbContentRight?: React.ReactNode;
    actionGroupContent?: React.ReactNode;
    sidebarFooter?: React.ReactNode;
}

interface SidebarToggleButtonProps {
    open: boolean;
    onClick: () => void;
}

const SidebarToggleButton: React.FC<SidebarToggleButtonProps> = ({open, onClick}) => {
    const Icon = IconLayoutSidebar;
    const label = t`Open sidebar`;

    return (
        <UnstyledButton
            className={open ? classes.sidebarOpen : classes.sidebarClose}
            onClick={onClick}
            aria-label={label}
            aria-controls="app-sidebar"
            aria-expanded={false}
        >
            <Icon size={16}/>
            <VisuallyHidden>{label}</VisuallyHidden>
        </UnstyledButton>
    );
};

const AppLayout: React.FC<AppLayoutProps> = ({
                                                 navItems,
                                                 breadcrumbItems,
                                                 entityType,
                                                 topBarContent = null,
                                                 breadcrumbContentRight = null,
                                                 actionGroupContent = null,
                                                 sidebarFooter = null,
                                             }) => {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true; // SSR default
        return window.innerWidth >= 768; // Desktop open, mobile closed
    });
    const [topBarShadow, setTopBarShadow] = useState<boolean>(false);
    const mainRef = useRef<HTMLElement>(null);
    const location = useLocation();

    useEffect(() => {
        const mainElement = document.getElementById('app-manage-main');
        if (mainElement) {
            const handleScroll = () => {
                setTopBarShadow(mainElement.scrollTop > 10);
            };
            mainElement.addEventListener('scroll', handleScroll);
            return () => mainElement.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        mainRef.current?.focus({preventScroll: true});
    }, [location.pathname]);

    useEffect(() => {
        if (!sidebarOpen || window.innerWidth >= 768) return;

        const previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setSidebarOpen(false);
            }
        };

        const handleViewportResize = () => {
            document.body.style.overflow = window.innerWidth < 768 ? 'hidden' : previousBodyOverflow;
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', handleViewportResize);
        return () => {
            document.body.style.overflow = previousBodyOverflow;
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleViewportResize);
        };
    }, [sidebarOpen]);

    return (
        <>
            <ImpersonationBanner />
            <PendingDeletionBanner />
            <AnnouncementDisplay />
            <a className={classes.skipLink} href="#app-manage-main">{t`Skip to main content`}</a>
            <div id={`${entityType}-manage-container`}
                 className={`${classes.container} ${sidebarOpen ? classes.open : classes.closed}`}>
                <Topbar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    topBarShadow={topBarShadow}
                    breadcrumbItems={breadcrumbItems}
                    topBarContent={topBarContent}
                    breadcrumbContentRight={breadcrumbContentRight}
                    actionGroupContent={actionGroupContent}
                />

            <main
                ref={mainRef}
                className={classes.main}
                id="app-manage-main"
                tabIndex={-1}
            >
                <Outlet/>
            </main>

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                navItems={navItems}
                sidebarFooter={sidebarFooter}
            />

            {sidebarOpen && (
                <div
                    className={`${classes.overlay} ${sidebarOpen ? classes.open : ''}`}
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            {!sidebarOpen && (
                <SidebarToggleButton
                    open={false}
                    onClick={() => setSidebarOpen(true)}
                />
            )}
            </div>
        </>
    );
};

export default AppLayout;
