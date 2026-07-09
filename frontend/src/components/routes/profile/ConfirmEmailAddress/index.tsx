import {useNavigate, useParams} from "react-router";
import {useGetMe} from "../../../../queries/useGetMe";
import {Card} from "../../../common/Card";
import {showError, showSuccess} from "../../../../utilites/notifications";
import {t} from "@lingui/macro";
import {useConfirmEmailAddress} from "../../../../mutations/useConfirmEmailAddress";
import {useEffect} from "react";
import {Loader} from "@mantine/core";
import {IconMailCheck} from "@tabler/icons-react";
import classes from "../ProfileStatus.module.scss";

const ConfirmEmailAddress = () => {
    const {token} = useParams();
    const {data: userData, isFetched} = useGetMe();
    const navigate = useNavigate();
    const confirmEmailAddressMutation = useConfirmEmailAddress();

    const confirmEmail = () => {

        if (!userData?.id) {
            return;
        }

        confirmEmailAddressMutation.mutate({token: (token as string), userId: userData?.id}, {
            onSuccess: () => {
                showSuccess(t`Successfully confirmed email address`);
                navigate('/manage/events');
            },
            onError: () => {
                showError(t`Error confirming email address`);
            }
        });
    };

    useEffect(() => confirmEmail(), [isFetched]);

    return (
        <div className={classes.statusShell}>
            <Card className={classes.statusCard}>
                <div className={classes.statusHeader}>
                    <span className={classes.statusIcon}>
                        <IconMailCheck size={18}/>
                    </span>
                    <div>
                        <h1 className={classes.statusTitle}>{t`Confirming email address`}</h1>
                        <p className={classes.statusText}>{t`Please wait while we verify your email address.`}</p>
                    </div>
                </div>
                <Loader size="sm"/>
            </Card>
        </div>
    );
};

export default ConfirmEmailAddress;
