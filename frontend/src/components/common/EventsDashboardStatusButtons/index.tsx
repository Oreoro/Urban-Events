import {Button, Group} from "@mantine/core";
import {t} from "@lingui/macro";
import {useNavigate} from "react-router";
import classes from './EventsDashboardStatusButtons.module.scss';

interface EventsDashboardStatusButtonsProps {
    baseUrl: string;
    eventsState: string;
}

export const EventsDashboardStatusButtons = ({baseUrl, eventsState}: EventsDashboardStatusButtonsProps) => {
    const navigate = useNavigate();
    const isUpcoming = eventsState === 'upcoming' || !eventsState;

    return (
        <Group className={classes.statusGroup} mt={8} mb={12} gap={4}>
            <Button
                className={classes.statusButton}
                size={'compact-sm'}
                variant={isUpcoming ? 'light' : 'subtle'}
                data-active={isUpcoming}
                onClick={() => navigate(baseUrl + '/upcoming' + window.location.search)}
            >
                {t`Upcoming`}
            </Button>
            <Button size={'compact-sm'}
                    className={classes.statusButton}
                    variant={eventsState === 'ended' ? 'light' : 'subtle'}
                    data-active={eventsState === 'ended'}
                    onClick={() => navigate(baseUrl + '/ended' + window.location.search)}
            >
                {t`Ended`}
            </Button>
            <Button size={'compact-sm'}
                    className={classes.statusButton}
                    variant={eventsState === 'archived' ? 'light' : 'subtle'}
                    data-active={eventsState === 'archived'}
                    onClick={() => navigate(baseUrl + '/archived' + window.location.search)}
            >
                {t`Archived`}
            </Button>
        </Group>
    );
}
