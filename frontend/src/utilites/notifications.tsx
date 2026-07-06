import {notifications} from "@mantine/notifications";
import {IconCheck, IconInfoSmall, IconX} from "@tabler/icons-react";
import React, {ReactNode} from "react";

const notificationDefaults = {
    autoClose: 2600,
    position: 'top-center' as const,
    withCloseButton: true,
};

export const showSuccess = (message: ReactNode, icon: ReactNode = <IconCheck size={16}/>) => {
    notifications.show({
        ...notificationDefaults,
        message,
        color: 'primary',
        icon,
        'data-status': 'success',
    })
}

export const showInfo = (message: ReactNode, icon: ReactNode = <IconInfoSmall size={17}/>) => {
    notifications.show({
        ...notificationDefaults,
        message,
        color: 'primary',
        icon,
        'data-status': 'info',
    })
}

export const showError = (message: React.ReactNode, icon: ReactNode = <IconX size={16}/>) => {
    notifications.show({
        ...notificationDefaults,
        message,
        color: 'red',
        icon,
        autoClose: 4200,
        'data-status': 'error',
    })
}
