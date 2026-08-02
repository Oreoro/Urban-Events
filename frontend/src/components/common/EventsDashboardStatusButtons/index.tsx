import {Button, Group} from "@mantine/core";
import {t} from "@lingui/macro";
import {NavLink, useLocation} from "react-router";
import classes from "./EventsDashboardStatusButtons.module.scss";

interface EventsDashboardStatusButtonsProps {
    baseUrl: string;
    eventsState: string;
}

export const EventsDashboardStatusButtons = ({baseUrl, eventsState}: EventsDashboardStatusButtonsProps) => {
    const {search} = useLocation();
    const statuses = [
        {value: 'upcoming', label: t`Upcoming`, active: eventsState === 'upcoming' || !eventsState},
        {value: 'ended', label: t`Ended`, active: eventsState === 'ended'},
        {value: 'archived', label: t`Archived`, active: eventsState === 'archived'},
    ];

    return (
        <nav aria-label={t`Event status`}>
            <Group mt={10} mb={15} gap={8}>
                {statuses.map((status) => (
                    <Button
                        key={status.value}
                        component={NavLink}
                        to={`${baseUrl}/${status.value}${search}`}
                        size="compact-sm"
                        variant={status.active ? 'light' : 'transparent'}
                        aria-current={status.active ? 'page' : undefined}
                        className={classes.statusButton}
                    >
                        {status.label}
                    </Button>
                ))}
            </Group>
        </nav>
    );
}
