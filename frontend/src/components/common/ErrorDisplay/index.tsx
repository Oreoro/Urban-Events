import {t} from '@lingui/macro';
import {Box, Button, Container, Stack, Text, Title} from '@mantine/core';
import {IconHome} from '@tabler/icons-react';
import classes from './ErrorDisplay.module.scss';
import {Helmet} from "react-helmet-async";
import {NavLink, useRouteError} from "react-router";
import {PoweredByFooter} from "../PoweredByFooter";
import {BrandWordmark} from "../BrandWordmark";

export const ErrorDisplay = () => {
    const error = useRouteError() as any;

    const title = error?.status === 404
        ? t`Page not found`
        : t`Something went wrong`;

    const description = error?.status === 404
        ? t`The page you are looking for does not exist`
        : t`An error occurred while loading the page`;

    console.log('ErrorDisplay error:', error);

    return (
        <>
            <Helmet
                title={title}
                meta={[
                    {
                        name: 'description',
                        content: description,
                    },
                ]}
            />
            <Box className={classes.wrapper}>
                <Container size="md" className={classes.root}>
                    <Stack gap="xl" align="center">
                        <BrandWordmark tone="dark" size="md" className={classes.logo}/>

                        <Stack gap="lg" align="center" className={classes.content}>
                            <Title order={1} className={classes.title}>
                                {title}
                            </Title>

                            <Text size="lg" c="dimmed" className={classes.description}>
                                {description}
                            </Text>
                            <Button
                                component={NavLink}
                                to="/"
                                leftSection={<IconHome size={18}/>}
                                variant="filled"
                                className={classes.button}
                            >
                                {t`Go to home page`}
                            </Button>
                        </Stack>

                        <PoweredByFooter/>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default ErrorDisplay;
