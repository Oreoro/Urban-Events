import {usePollGetOrderPublic} from "../../../../queries/usePollGetOrderPublic.ts";
import {useNavigate, useParams, useLocation} from "react-router";
import {useEffect, useState} from "react";
import classes from './PaymentReturn.module.scss';
import {t} from "@lingui/macro";
import {CheckoutContent} from "../../../layouts/Checkout/CheckoutContent";
import {eventCheckoutPath} from "../../../../utilites/urlHelper.ts";
import {HomepageInfoMessage} from "../../../common/HomepageInfoMessage";
import {isSsr} from "../../../../utilites/helpers.ts";
import {useConfirmNeemPayment} from "../../../../queries/useConfirmNeemPayment.ts";

/**
 * This component is responsible for handling the return from the payment provider.
 * Stripe should send a webhook to the backend to update the order status to 'COMPLETED'
 * However, if this fails, we will poll the order status to check if the payment has been processed.
 * This is a rare occurrence, but we should handle it gracefully.
 * It will also make local development easier in times when the webhook is not configured correctly.
 **/
export const PaymentReturn = () => {
    const [shouldPoll, setShouldPoll] = useState(false);
    let {eventId, orderShortId} = useParams();

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const status = queryParams.get('status');
    const transactionId = queryParams.get('transactionId');
    const basketId = queryParams.get('basketId');

    const {
        data: neemData,
        isFetched: isNeemFetched,
        error: neemPaymentError
    } = useConfirmNeemPayment(eventId, orderShortId, status, transactionId, basketId);

    // Start polling only when payment is confirmed
    useEffect(() => {
        if (isNeemFetched && neemData?.success) {
            setShouldPoll(true);
        }
    }, [isNeemFetched, neemData]);

    const { data: order } = usePollGetOrderPublic(eventId, orderShortId, shouldPoll, ['event']);
    const navigate = useNavigate();

    // Redirect when polling gets the completed order
    useEffect(() => {
        if (isSsr() || !order) return;

        if (order?.status === 'COMPLETED') {
            navigate(eventCheckoutPath(eventId, orderShortId, 'summary'));
        }

        if (order?.payment_status === 'PAYMENT_FAILED' ||
            (typeof window !== 'undefined' && window?.location.search.includes('failed'))) {
            navigate(eventCheckoutPath(eventId, orderShortId, 'payment') + '?payment_failed=true');
        }
    }, [order]);

    return (
        <CheckoutContent>
            <div className={classes.container}>
                {!neemPaymentError && (
                    <HomepageInfoMessage
                        iconType={'processing'}
                        message={(
                            <>
                                {!shouldPoll && isNeemFetched && neemData?.payment !== 'CONFIRMED' && t`We could not confirm your payment. Please try again or contact support.`}
                                {!shouldPoll && isNeemFetched && neemData?.payment === 'CONFIRMED' && t`Almost there! We're just waiting for your payment to be processed.`}
                                {shouldPoll && t`We're processing your order. Please wait...`}
                            </>
                        )}
                    />
                )}

                {neemPaymentError && (
                    <HomepageInfoMessage
                        iconType={'error'}
                        message={t`We were unable to confirm your payment. Please try again or contact support.`}
                    />
                )}
            </div>
        </CheckoutContent>
    );
};

export default PaymentReturn;
