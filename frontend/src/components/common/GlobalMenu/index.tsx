import {Avatar, Menu, UnstyledButton} from "@mantine/core";
import {getInitials} from "../../../utilites/helpers.ts";
import {
    IconLifebuoy,
    IconLogout,
    IconPlus,
    IconSettingsCog,
    IconShield,
    IconUser,
    IconUsers,
} from "@tabler/icons-react";
import {useGetMe} from "../../../queries/useGetMe.ts";
import {NavLink} from "react-router";
import {t} from "@lingui/macro";
import {authClient} from "../../../api/auth.client.ts";
import {useDisclosure} from "@mantine/hooks";
import {AboutModal} from "../../modals/AboutModal";
import {getConfig} from "../../../utilites/config.ts";
import {CreateOrganizerModal} from "../../modals/CreateOrganizerModal";
import classes from "./GlobalMenu.module.scss";
import type {ComponentType, MouseEventHandler} from "react";

interface Link {
    label: string;
    icon: ComponentType<{ size?: number; stroke?: number }>;
    link?: string;
    target?: string;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const GlobalMenu = () => {
    const {data: me} = useGetMe();
    const [aboutModalOpen, {open: openAboutModal, close: closeAboutModal}] = useDisclosure(false);
    const [createOrganizerModalOpen, {
        open: openCreateOrganizerModal,
        close: closeCreateOrganizerModal
    }] = useDisclosure(false);


    const links: Link[] = [
        {
            label: t`My Profile`,
            icon: IconUser,
            link: "/manage/profile",
        },
        {
            label: t`Account Settings`,
            icon: IconSettingsCog,
            link: `/account/settings`,
        },
    ];

    if (me?.role === 'ADMIN' || me?.role === 'SUPERADMIN') {
        links.push({
            label: t`User Management`,
            icon: IconUsers,
            link: `/account/users`
        })
    }

    if (me?.role === 'SUPERADMIN') {
        links.push({
            label: t`Admin Dashboard`,
            icon: IconShield,
            link: `/admin`
        })
    }

    if (!getConfig("VITE_HIDE_ABOUT_LINK")) {
        links.push({
            label: t`About & Support`,
            icon: IconLifebuoy,
            onClick: (event) => {
                event.preventDefault();
                openAboutModal();
            },
        });
    }

    links.push({
        label: t`Create Organizer`,
        icon: IconPlus,
        onClick: (event) => {
            event.preventDefault();
            openCreateOrganizerModal();
        }
    });

    links.push({
        label: t`Logout`,
        icon: IconLogout,
        onClick: async (event) => {
            event.preventDefault();
            await authClient.logout();
            localStorage.removeItem("token");
            window.location.href = "/auth/login";
        },
    });

    return (
        <>
            <Menu shadow="xs" width={220} position="bottom-end" offset={10}>
                <Menu.Target>
                    <UnstyledButton className={classes.menuButton}>
                        <Avatar className={classes.avatar} radius="xl" fw={800}>
                            {me ? getInitials(me.first_name + " " + me.last_name) : ".."}
                        </Avatar>
                    </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown className={classes.dropdown}>
                    {links.map((link) => {
                        const Icon = link.icon;

                        return (
                            <NavLink
                                onClick={link.onClick}
                                to={link.link ?? "#"}
                                key={link.label}
                                target={link.target ?? ""}
                            >
                                <Menu.Item
                                    component={"div"}
                                    className={classes.menuItem}
                                    leftSection={<Icon size={18} stroke={1.7}/>}
                                >
                                    {link.label}
                                </Menu.Item>
                            </NavLink>
                        );
                    })}
                </Menu.Dropdown>
            </Menu>
            {aboutModalOpen && <AboutModal onClose={closeAboutModal}/>}
            {createOrganizerModalOpen && <CreateOrganizerModal onClose={closeCreateOrganizerModal}/>}
        </>
    );
};
