import {useNavigate, useParams} from "react-router";
import {useGetMe} from "../../../../queries/useGetMe.ts";
import {useConfirmEmailChange} from "../../../../mutations/useConfirmEmailChange.ts";
import {Anchor, Button} from "@mantine/core";
import {Card} from "../../../common/Card";
import {showError, showSuccess} from "../../../../utilites/notifications.tsx";
import {t, Trans} from "@lingui/macro";
import {IconAlertCircle, IconMailCheck} from "@tabler/icons-react";
import classes from "../ProfileStatus.module.scss";

const MessageCard = ({message, linkText, linkHref}: { message: string, linkText: string, linkHref: string }) => (
    <div className={classes.statusShell}>
        <Card className={classes.statusCard}>
            <div className={classes.statusHeader}>
                <span className={classes.statusIcon}>
                    <IconAlertCircle size={18}/>
                </span>
                <p className={classes.statusText}>
                    {message} <Anchor href={linkHref} className={classes.statusLink}>{linkText}</Anchor>.
                </p>
            </div>
        </Card>
    </div>
);

export const ConfirmEmailChange = () => {
    const {token} = useParams();
    const {data: userData, isFetched} = useGetMe();
    const navigate = useNavigate();
    const {mutate} = useConfirmEmailChange();

    if (!token) {
        return <MessageCard message={t`The link you clicked is invalid.`}
                            linkText={t`Go back to profile`}
                            linkHref="/manage/profile"
        />;
    }

    const confirmChange = () => {
        mutate({token: token, userId: userData?.id}, {
            onSuccess: () => {
                showSuccess(t`Successfully confirmed email change`);
                navigate('/manage/profile');
            },
            onError: () => {
                showError(t`Error confirming email change`);
            }
        });
    };

    if (isFetched && !userData?.pending_email) {
        return <MessageCard message={t`You have no pending email change.`}
                            linkText={t`Go back to profile`}
                            linkHref="/manage/profile"
        />;
    }

    return (
        <>
            {isFetched && (
                <div className={classes.statusShell}>
                    <Card className={classes.statusCard}>
                        <div className={classes.statusHeader}>
                            <span className={classes.statusIcon}>
                                <IconMailCheck size={18}/>
                            </span>
                            <div>
                                <h1 className={classes.statusTitle}>{t`Confirm Email Change`}</h1>
                                <p className={classes.statusText}>
                                    <Trans>You are changing your email to <b>{userData?.pending_email}</b>.</Trans>
                                </p>
                            </div>
                        </div>
                        <Button onClick={confirmChange} className={classes.statusAction}>
                            {t`Confirm Email Change`}
                        </Button>
                    </Card>
                </div>
            )}
        </>
    );
};

export default ConfirmEmailChange;
