import {t} from "@lingui/macro";
import {Stack, Text, Button, ThemeIcon} from "@mantine/core";
import {IconLinkOff} from "@tabler/icons-react";
import {useNavigate} from "react-router";
import {Card} from "../../../../common/Card";
import classes from "./LinkExpiredMessage.module.scss";

export const LinkExpiredMessage = () => {
    const navigate = useNavigate();

    const handleLookupTickets = () => {
        navigate('/auth/login');
    };

    return (
        <Card className={classes.expiredCard}>
            <Stack align="center" gap="lg">
                <ThemeIcon
                    size={48}
                    radius="md"
                    variant="light"
                    className={classes.expiredIcon}
                >
                    <IconLinkOff size={26}/>
                </ThemeIcon>
                <div>
                    <Text className={classes.expiredTitle} mb="xs">
                        {t`This link is no longer valid`}
                    </Text>
                    <Text size="sm" className={classes.expiredText}>
                        {t`The link you are trying to access has expired or is no longer valid. Please check your email for an updated link to manage your order.`}
                    </Text>
                </div>
                <Button
                    onClick={handleLookupTickets}
                    size="md"
                >
                    {t`Look Up My Tickets`}
                </Button>
            </Stack>
        </Card>
    );
};
