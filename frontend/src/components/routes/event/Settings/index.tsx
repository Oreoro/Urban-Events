import {PageBody} from "../../../common/PageBody";
import {EventDetailsForm} from "./Sections/EventDetailsForm";
import {LocationSettings} from "./Sections/LocationSettings";
import {HomepageAndCheckoutSettings} from "./Sections/HomepageAndCheckoutSettings";
import {EmailSettings} from "./Sections/EmailSettings";
import {PageTitle} from "../../../common/PageTitle";
import {t} from "@lingui/macro";
import {SeoSettings} from "./Sections/SeoSettings";
import {MiscSettings} from "./Sections/MiscSettings";
import {NavLink as MantineNavLink, Stack} from "@mantine/core";
import {
    IconAdjustments,
    IconAlertTriangle,
    IconAt,
    IconBrandGoogleAnalytics,
    IconBuildingStore,
    IconCreditCard,
    IconHome,
    IconListCheck,
    IconMapPin,
    IconPercentage,
} from "@tabler/icons-react";
import {useEffect, useMemo, useState} from "react";
import {PaymentAndInvoicingSettings} from "./Sections/PaymentSettings";
import {PlatformFeesSettings} from "./Sections/PlatformFeesSettings";
import {WaitlistSettings} from "./Sections/WaitlistSettings";
import {DangerZoneSettings} from "./Sections/DangerZoneSettings";
import {useGetAccount} from "../../../../queries/useGetAccount.ts";
import classes from "../../../common/SettingsShell/SettingsShell.module.scss";

export const Settings = () => {
    const {data: account} = useGetAccount();
    const isSaasMode = account?.is_saas_mode_enabled;

    const SECTIONS = useMemo(() => {
        const baseSections = [
            {
                id: 'event-details',
                label: t`Event Details`,
                icon: IconBuildingStore,
                component: EventDetailsForm
            },
            {
                id: 'location-settings',
                label: t`Location`,
                icon: IconMapPin,
                component: LocationSettings
            },
            {
                id: 'homepage-settings',
                label: t`Checkout`,
                icon: IconHome,
                component: HomepageAndCheckoutSettings
            },
            {
                id: 'seo-settings',
                label: t`SEO`,
                icon: IconBrandGoogleAnalytics,
                component: SeoSettings
            },
            {
                id: 'email-settings',
                label: t`Email & Templates`,
                icon: IconAt,
                component: EmailSettings
            },
            {
                id: 'misc-settings',
                label: t`Miscellaneous`,
                icon: IconAdjustments,
                component: MiscSettings
            },
            {
                id: 'waitlist-settings',
                label: t`Waitlist`,
                icon: IconListCheck,
                component: WaitlistSettings,
            },
            {
                id: 'payment-settings',
                label: t`Payment & Invoicing`,
                icon: IconCreditCard,
                component: PaymentAndInvoicingSettings,
            },
            {
                id: 'danger-zone',
                label: t`Danger Zone`,
                icon: IconAlertTriangle,
                component: DangerZoneSettings,
                tone: 'danger',
            }
        ];

        if (isSaasMode) {
            baseSections.splice(baseSections.length - 1, 0, {
                id: 'platform-fees',
                label: t`Platform Fees`,
                icon: IconPercentage,
                component: PlatformFeesSettings,
            });
        }

        return baseSections;
    }, [isSaasMode]);

    const [activeSection, setActiveSection] = useState(() => {
        if (typeof window === 'undefined') return 'event-details';
        const hash = window.location.hash.replace('#', '');
        return hash || 'event-details';
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            setActiveSection(hash);
            setTimeout(() => {
                document.getElementById(hash)?.scrollIntoView({behavior: 'smooth'});
            }, 100);
        }
    }, []);

    const handleClick = (sectionId: string) => {
        setActiveSection(sectionId);
        window.history.replaceState(null, '', `#${sectionId}`);
        document.getElementById(sectionId)?.scrollIntoView({behavior: 'smooth'});
    };

    const sideMenu = (
        <nav className={classes.sideMenu} aria-label={t`Event settings sections`}>
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
                            leftSection={<section.icon className={classes.navIcon} size={16} stroke={1.6}/>}
                            onClick={() => handleClick(section.id)}
                        />
                    );
                })}
            </Stack>
        </nav>
    );

    const content = SECTIONS.map(({id, component: Component}) => (
        <section key={id} id={id} className={classes.settingSection}>
            <Component/>
        </section>
    ));

    return (
        <PageBody>
            <PageTitle
                subheading={t`Configure event details, location, checkout options, and email notifications.`}
            >{t`Event Settings`}</PageTitle>

            <div className={classes.settingsLayout}>
                <aside className={classes.sideRail}>
                    {sideMenu}
                </aside>
                <main className={classes.content}>{content}</main>
            </div>
        </PageBody>
    );
};

export default Settings;
