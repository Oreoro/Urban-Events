import {notifications} from '@mantine/notifications';
import {IconCheck, IconX} from '@tabler/icons-react';

interface NotificationMessages {
    loading: {
        title: string;
        message: string;
    };
    success: {
        title: string;
        message: string;
        onRun?: () => void;
    };
    error: {
        title: string;
        message: string;
        onRun?: () => void;
    };
}

export const withLoadingNotification = async <T, >(
    asyncOperation: () => Promise<T>,
    messages: NotificationMessages
): Promise<T> => {
    const notificationId = notifications.show({
        loading: true,
        title: messages.loading.title,
        message: messages.loading.message,
        autoClose: false,
        withCloseButton: false,
        position: 'top-center',
        'data-status': 'loading',
    });

    try {
        const result = await asyncOperation();

        notifications.update({
            id: notificationId,
            title: messages.success.title,
            message: messages.success.message,
            color: 'primary',
            icon: <IconCheck size="1rem"/>,
            autoClose: 2000,
            loading: false,
            position: 'top-center',
            withCloseButton: true,
            'data-status': 'success',
        });

        if (messages.success.onRun) {
            messages.success.onRun();
        }

        return result;
    } catch (error) {
        notifications.update({
            id: notificationId,
            title: messages.error.title,
            message: messages.error.message,
            color: 'red',
            icon: <IconX size="1rem"/>,
            autoClose: 4200,
            loading: false,
            position: 'top-center',
            withCloseButton: true,
            'data-status': 'error',
        });

        if (messages.error.onRun) {
            messages.error.onRun();
        }

        throw error;
    }
};
