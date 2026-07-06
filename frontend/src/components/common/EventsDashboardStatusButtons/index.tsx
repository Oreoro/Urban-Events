import {Button, Group} from "@mantine/core";
import {t} from "@lingui/macro";
import {useNavigate} from "react-router";

interface EventsDashboardStatusButtonsProps {
    baseUrl: string;
    eventsState: string;
}

export const EventsDashboardStatusButtons = ({baseUrl, eventsState}: EventsDashboardStatusButtonsProps) => {
    const navigate = useNavigate();

    return (
        <Group mt={8} mb={12} gap={6}>
            <Button
                size={'compact-sm'}
                variant={eventsState === 'upcoming' || !eventsState ? 'light' : 'subtle'}
                onClick={() => navigate(baseUrl + '/upcoming' + window.location.search)}
            >
                {t`Upcoming`}
            </Button>
            <Button size={'compact-sm'}
                    variant={eventsState === 'ended' ? 'light' : 'subtle'}
                    onClick={() => navigate(baseUrl + '/ended' + window.location.search)}
            >
                {t`Ended`}
            </Button>
            <Button size={'compact-sm'}
                    variant={eventsState === 'archived' ? 'light' : 'subtle'}
                    onClick={() => navigate(baseUrl + '/archived' + window.location.search)}
            >
                {t`Archived`}
            </Button>
        </Group>
    );
}
