import {Attendee} from "../../../types.ts";
import {Badge} from "@mantine/core";
import {t} from "@lingui/macro";

interface AttendeeStatusBadgeProps {
    attendee: Attendee;
    noStyle?: boolean;
}

export const AttendeeStatusBadge = ({attendee, noStyle = false}: AttendeeStatusBadgeProps) => {
    let color;
    let textColor;

    switch (attendee.status) {
        case 'AWAITING_PAYMENT':
            color = 'orange';
            textColor = 'var(--hi-status-warning-text)';
            break;
        case 'CANCELLED':
            color = 'red';
            textColor = 'var(--hi-status-danger-text)';
            break;
        case 'ACTIVE':
        default:
            color = 'green';
            textColor = 'var(--hi-status-success-text)';
            break;
    }

    const statusLabels: Record<string, string> = {
        'ACTIVE': t`Active`,
        'CANCELLED': t`Cancelled`,
        'AWAITING_PAYMENT': t`Awaiting Payment`,
    };

    const status = statusLabels[attendee.status] || attendee.status.replace('_', ' ');

    if (noStyle) {
        return <span style={{color: textColor}}>{status}</span>;
    }

    return (
        <Badge variant={'light'} color={color}>
            {status}
        </Badge>
    );
};
