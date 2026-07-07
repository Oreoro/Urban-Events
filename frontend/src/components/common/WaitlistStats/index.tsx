import {WaitlistStats as WaitlistStatsType} from "../../../types.ts";
import {Paper, SimpleGrid, Text} from "@mantine/core";
import {t} from "@lingui/macro";
import classes from "./WaitlistStats.module.scss";

interface WaitlistStatsProps {
    stats: WaitlistStatsType;
}

export const WaitlistStatsCards = ({stats}: WaitlistStatsProps) => {
    const statItems = [
        {label: t`Total Entries`, value: stats.total},
        {label: t`Waiting`, value: stats.waiting},
        {label: t`Offered`, value: stats.offered},
        {label: t`Purchased`, value: stats.purchased},
    ];

    return (
        <SimpleGrid cols={{base: 2, sm: 4}} visibleFrom="sm" className={classes.statsGrid}>
            {statItems.map((item) => (
                <Paper key={item.label} withBorder p="md" radius="md" className={classes.statCard}>
                    <Text className={classes.statLabel}>
                        {item.label}
                    </Text>
                    <Text className={classes.statValue}>
                        {item.value}
                    </Text>
                </Paper>
            ))}
        </SimpleGrid>
    );
};
