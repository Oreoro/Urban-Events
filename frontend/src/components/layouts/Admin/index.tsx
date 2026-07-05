import {IconUsers, IconBuildingBank, IconLayoutDashboard, IconCalendar, IconReceipt, IconSettings, IconChartBar, IconAlertTriangle, IconMail} from "@tabler/icons-react";
import {t} from "@lingui/macro";
import {NavItem, BreadcrumbItem} from "../AppLayout/types";
import AppLayout from "../AppLayout";
import {AuthGuard} from "../../common/AuthGuard";

const AdminLayoutContent = () => {
    const navItems: NavItem[] = [
        {label: t`Admin`},
        {link: '', label: t`Dashboard`, icon: IconLayoutDashboard},
        {link: 'accounts', label: t`Accounts`, icon: IconBuildingBank},
        {link: 'users', label: t`Users`, icon: IconUsers},
        {link: 'events', label: t`Events`, icon: IconCalendar},
        {link: 'orders', label: t`Orders`, icon: IconReceipt},
        {link: 'messages', label: t`Messages`, icon: IconMail},
        {link: 'attribution', label: t`UTM Analytics`, icon: IconChartBar},
        {link: 'failed-jobs', label: t`Failed Jobs`, icon: IconAlertTriangle},
        {link: 'configurations', label: t`Configurations`, icon: IconSettings},
    ];

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            link: '/admin',
            content: t`Admin Dashboard`
        }
    ];

    return (
        <AppLayout
            navItems={navItems}
            breadcrumbItems={breadcrumbItems}
            entityType="organizer"
        />
    );
};

const AdminLayout = () => (
    <AuthGuard requireSuperAdmin>
        <AdminLayoutContent/>
    </AuthGuard>
);

export default AdminLayout;
