import React from 'react';
import {Box, Button, Container, Stack, Text, Title} from '@mantine/core';
import {IconHome} from '@tabler/icons-react';
import classes from './GenericErrorPage.module.scss';
import {PoweredByFooter} from "../PoweredByFooter";
import {Helmet} from "react-helmet-async";
import {BrandWordmark} from "../BrandWordmark";

interface GenericErrorPageProps {
    title: string;
    description: string;
    pageTitle?: string;
    metaDescription?: string;
    buttonText?: string;
    buttonUrl?: string;
    buttonIcon?: React.ReactNode;
    children?: React.ReactNode;
}

export const GenericErrorPage: React.FC<GenericErrorPageProps> = ({
                                                                      title,
                                                                      description,
                                                                      pageTitle,
                                                                      metaDescription,
                                                                      buttonText,
                                                                      buttonUrl,
                                                                      buttonIcon = <IconHome size={18}/>,
                                                                      children
                                                                  }) => {
    return (
        <>
            <Helmet
                title={pageTitle || title}
                meta={[
                    {
                        name: 'description',
                        content: metaDescription || description,
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

                            {children}

                            {buttonText && buttonUrl && (
                                <Button
                                    component="a"
                                    href={buttonUrl}
                                    leftSection={buttonIcon}
                                    variant="filled"
                                    className={classes.button}
                                >
                                    {buttonText}
                                </Button>
                            )}
                        </Stack>

                        <PoweredByFooter/>
                    </Stack>
                </Container>
            </Box>
        </>
    );
};

export default GenericErrorPage;
