import { SeoSettings } from "./Sections/SeoSettings";
import BasicSettings from "./Sections/BasicSettings";
import { SocialLinks } from "./Sections/SocialLinks";
import { AddressSettings } from "./Sections/AddressSettings";
import EmailTemplateSettings from "./Sections/EmailTemplateSettings";
import { EventDefaults } from "./Sections/EventDefaults";
import { PlatformFeesSettings } from "./Sections/PlatformFeesSettings";
import { DangerZoneSettings } from "./Sections/DangerZoneSettings";
import { TrackingPixelSettings } from "./Sections/TrackingPixelSettings";
import { PageBody } from "../../../common/PageBody";
import { PageTitle } from "../../../common/PageTitle";
import { t } from "@lingui/macro";
import { NavLink as MantineNavLink, Stack } from "@mantine/core";
import { IconAlertTriangle, IconBrandGoogleAnalytics, IconInfoCircle, IconMapPin, IconShare, IconMail, IconCalendarEvent, IconPercentage, IconChartBar } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import { useGetAccount } from "../../../../queries/useGetAccount.ts";
import classes from "../../../common/SettingsShell/SettingsShell.module.scss";

const Settings = () => {
    const { organizerId } = useParams();
    const { data: account } = useGetAccount();
    const isSaasMode = account?.is_saas_mode_enabled;

    const SECTIONS = useMemo(() => {
        const baseSections = [
            {
                id: 'basic-settings',
                label: t`Basic Information`,
                icon: IconInfoCircle,
                component: BasicSettings
            },
            {
                id: 'event-defaults',
                label: t`Event Defaults`,
                icon: IconCalendarEvent,
                component: EventDefaults
            },
            {
                id: 'address-settings',
                label: t`Address`,
                icon: IconMapPin,
                component: AddressSettings
            },
            // {
            //     id: 'image-assets',
            //     label: t`Images & Branding`,
            //     icon: IconPhoto,
            //     component: ImageAssetSettings
            // },
            {
                id: 'social-links',
                label: t`Social Links`,
                icon: IconShare,
                component: SocialLinks
            },
            {
                id: 'seo-settings',
                label: t`SEO`,
                icon: IconBrandGoogleAnalytics,
                component: SeoSettings
            },
            {
                id: 'email-templates',
                label: t`Email Templates`,
                icon: IconMail,
                component: () => <EmailTemplateSettings organizerId={organizerId!} />
            },
            {
                id: 'tracking-pixels',
                label: t`Tracking & Analytics`,
                icon: IconChartBar,
                component: TrackingPixelSettings,
            },
            {
                id: 'danger-zone',
                label: t`Danger Zone`,
                icon: IconAlertTriangle,
                component: DangerZoneSettings,
                tone: 'danger',
            },
        ];

        if (isSaasMode) {
            baseSections.splice(2, 0, {
                id: 'platform-fees',
                label: t`Platform Fees`,
                icon: IconPercentage,
                component: PlatformFeesSettings,
            });
        }

        return baseSections;
    }, [isSaasMode, organizerId]);

    const [activeSection, setActiveSection] = useState(() => {
        if (typeof window === 'undefined') return 'basic-settings';
        const hash = window.location.hash.replace('#', '');
        return hash || 'basic-settings';
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            setActiveSection(hash);
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, []);

    const handleClick = (sectionId: string) => {
        setActiveSection(sectionId);
        window.history.replaceState(null, '', `#${sectionId}`);
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    };

    const sideMenu = (
        <nav className={classes.sideMenu} aria-label={t`Organizer settings sections`}>
            <div className={classes.sideMenuTitle}>{t`Settings`}</div>
            <Stack className={classes.navList} gap={0}>
                {SECTIONS.map((section) => {
                    const isDanger = 'tone' in section && section.tone === 'danger';

                    return (
                        <MantineNavLink
                            key={section.id}
                            active={activeSection === section.id}
                            label={section.label}
                            className={`${classes.navLink} ${isDanger ? classes.navLinkDanger : ''}`}
                            leftSection={<section.icon className={classes.navIcon} size={16} stroke={1.6} />}
                            onClick={() => handleClick(section.id)}
                        />
                    );
                })}
            </Stack>
        </nav>
    );

    const content = SECTIONS.map(({ id, component: Component }) => (
        <section key={id} id={id} className={classes.settingSection}>
            <Component />
        </section>
    ));

    return (
        <PageBody>
            <PageTitle>{t`Organizer Settings`}</PageTitle>

            <div className={classes.settingsLayout}>
                <aside className={classes.sideRail}>
                    {sideMenu}
                </aside>
                <main className={classes.content}>{content}</main>
            </div>
        </PageBody>
    );
}

export default Settings;
