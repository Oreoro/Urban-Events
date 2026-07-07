import {Container, Title, Text, Paper, Stack, SimpleGrid, SegmentedControl, Table, Skeleton, Pagination, Group} from "@mantine/core";
import {t, Trans} from "@lingui/macro";
import {useGetUtmAttributionStats} from "../../../../queries/useGetUtmAttributionStats";
import {useState} from "react";
import {formatCurrency} from "../../../../utilites/currency";
import tableStyles from "../../../../styles/admin-table.module.scss";
import listClasses from "../AdminListPage.module.scss";
import classes from "./Attribution.module.scss";

const Attribution = () => {
    const [groupBy, setGroupBy] = useState<'source' | 'campaign' | 'medium' | 'source_type'>('source');
    const [page, setPage] = useState(1);
    const perPage = 20;

    const {data, isLoading} = useGetUtmAttributionStats({
        group_by: groupBy,
        page,
        per_page: perPage
    });

    const summary = data?.summary;
    const paginatedData = data?.data;
    const stats = paginatedData?.data || [];
    const totalPages = paginatedData?.last_page || 1;

    return (
        <Container size="xl" p="xl" className={listClasses.page}>
            <Stack gap="xl" className={listClasses.stack}>
                <div>
                    <Title order={1} mb="xs">
                        <Trans>Attribution Analytics</Trans>
                    </Title>
                    <Text size="sm" c="dimmed">
                        <Trans>Track account growth and performance by attribution source</Trans>
                    </Text>
                    <Text size="sm" c="dimmed" mt="xs">
                        <Trans>Statistics are based on account creation date</Trans>
                    </Text>
                </div>

                {isLoading ? (
                    <SimpleGrid cols={{base: 1, sm: 2, md: 4}} spacing="md">
                        <Skeleton height={100} radius="md" />
                        <Skeleton height={100} radius="md" />
                        <Skeleton height={100} radius="md" />
                        <Skeleton height={100} radius="md" />
                    </SimpleGrid>
                ) : summary && (
                    <SimpleGrid cols={{base: 1, sm: 2, md: 4}} spacing="md">
                        <Paper shadow="none" p="md" radius="md" withBorder className={classes.statCard}>
                            <div>
                                <Text className={classes.statLabel}>
                                    {t`Paid Accounts`}
                                </Text>
                                <Text className={classes.statValue}>
                                    {summary.paid_accounts.toLocaleString()}
                                </Text>
                            </div>
                        </Paper>

                        <Paper shadow="none" p="md" radius="md" withBorder className={classes.statCard}>
                            <div>
                                <Text className={classes.statLabel}>
                                    {t`Organic Accounts`}
                                </Text>
                                <Text className={classes.statValue}>
                                    {summary.organic_accounts.toLocaleString()}
                                </Text>
                            </div>
                        </Paper>

                        <Paper shadow="none" p="md" radius="md" withBorder className={classes.statCard}>
                            <div>
                                <Text className={classes.statLabel}>
                                    {t`Referral Accounts`}
                                </Text>
                                <Text className={classes.statValue}>
                                    {summary.referral_accounts.toLocaleString()}
                                </Text>
                            </div>
                        </Paper>

                        <Paper shadow="none" p="md" radius="md" withBorder className={classes.statCard}>
                            <div>
                                <Text className={classes.statLabel}>
                                    {t`Unattributed Accounts`}
                                </Text>
                                <Text className={classes.statValue}>
                                    {summary.unattributed_accounts.toLocaleString()}
                                </Text>
                            </div>
                        </Paper>
                    </SimpleGrid>
                )}

                <div className={classes.breakdown}>
                    <Group justify="space-between" className={classes.breakdownHeader}>
                        <Title order={2}>
                            <Trans>Attribution Breakdown</Trans>
                        </Title>
                        <SegmentedControl
                            value={groupBy}
                            onChange={(value) => {
                                setGroupBy(value as typeof groupBy);
                                setPage(1);
                            }}
                            data={[
                                {label: t`Source`, value: 'source'},
                                {label: t`Campaign`, value: 'campaign'},
                                {label: t`Medium`, value: 'medium'},
                                {label: t`Type`, value: 'source_type'}
                            ]}
                        />
                    </Group>

                    {isLoading ? (
                        <Stack gap="md">
                            <Skeleton height={400} radius="md" />
                        </Stack>
                    ) : stats.length === 0 ? (
                        <div className={tableStyles.emptyState}>
                            <Text c="dimmed" size="lg">
                                <Trans>No attribution data found</Trans>
                            </Text>
                        </div>
                    ) : (
                        <>
                            <div className={tableStyles.tableWrapper}>
                                <div className={tableStyles.tableScroll}>
                                    <Table className={tableStyles.table} highlightOnHover>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th>{t`Attribution Value`}</Table.Th>
                                                <Table.Th>{t`Accounts`}</Table.Th>
                                                <Table.Th>{t`Events`}</Table.Th>
                                                <Table.Th>{t`Live Events`}</Table.Th>
                                                <Table.Th>{t`Stripe Connected`}</Table.Th>
                                                <Table.Th>{t`Verified`}</Table.Th>
                                                <Table.Th>{t`Revenue`}</Table.Th>
                                                <Table.Th>{t`Orders`}</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {stats.map((stat, index) => (
                                                <Table.Tr key={index}>
                                                    <Table.Td>
                                                        <Text fw={600} size="sm">
                                                            {stat.attribution_value || t`(empty)`}
                                                        </Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{stat.total_accounts.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{stat.total_events.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{stat.live_events.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{stat.stripe_connected.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{stat.verified_accounts.toLocaleString()}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm" fw={600}>{formatCurrency(stat.total_revenue, 'USD')}</Text>
                                                    </Table.Td>
                                                    <Table.Td>
                                                        <Text size="sm">{stat.total_orders.toLocaleString()}</Text>
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </div>
                            </div>

                            {totalPages > 1 && (
                                <Group justify="center" mt="lg">
                                    <Pagination
                                        total={totalPages}
                                        value={page}
                                        onChange={setPage}
                                    />
                                </Group>
                            )}
                        </>
                    )}
                </div>
            </Stack>
        </Container>
    );
};

export default Attribution;
