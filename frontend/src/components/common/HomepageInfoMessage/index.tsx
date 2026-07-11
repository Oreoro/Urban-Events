import {Button} from "@mantine/core";
import {
    IconAlertTriangle,
    IconArrowRight,
    IconBuildingBank,
    IconCircleCheck,
    IconCircleX,
    IconClock,
    IconCreditCard,
    IconMessageCircle,
    IconSearch,
} from "@tabler/icons-react";
import classes from './HomepageInfoMessage.module.scss';
import React from "react";

type StatusType =
    | 'info'
    | 'processing'
    | 'success'
    | 'warning'
    | 'error'
    | 'expired'
    | 'cancelled'
    | 'not_found'
    | 'awaiting_payment'
    | 'offline_payment';

const getStatusIcon = (status: StatusType) => {
    const icons: Record<StatusType, typeof IconMessageCircle> = {
        info: IconMessageCircle,
        processing: IconClock,
        success: IconCircleCheck,
        warning: IconAlertTriangle,
        error: IconCircleX,
        expired: IconClock,
        cancelled: IconCircleX,
        not_found: IconSearch,
        awaiting_payment: IconCreditCard,
        offline_payment: IconBuildingBank,
    };
    return icons[status] || icons.info;
};

interface HomepageInfoMessageProps {
    message: React.ReactNode;
    subtitle?: string;
    link?: string;
    linkText?: string;
    status?: StatusType;
}

export const HomepageInfoMessage = ({
                                        message,
                                        subtitle,
                                        link,
                                        linkText,
                                    status = 'info',
                                    }: HomepageInfoMessageProps) => {
    const StatusIcon = getStatusIcon(status);

    return (
        <div className={classes.container}>
            <div className={classes.card}>
                <div className={classes.iconContainer}>
                    <StatusIcon className={classes.icon} stroke={1.7}/>
                </div>

                <h2 className={classes.title}>{message}</h2>

                {subtitle && (
                    <p className={classes.subtitle}>{subtitle}</p>
                )}

                {(link && linkText) && (
                    <Button
                        component="a"
                        href={link}
                        rightSection={<IconArrowRight size={16}/>}
                        className={classes.button}
                    >
                        {linkText}
                    </Button>
                )}
            </div>
        </div>
    );
};
