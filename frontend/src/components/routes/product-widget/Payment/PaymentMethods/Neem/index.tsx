import {useParams} from "react-router";
import {useCreateNeemPaymentIntent} from "../../../../../../queries/useCreateNeemPaymentIntent.ts";
import {useCallback, useEffect, useState} from "react";
import {useGetEventPublic} from "../../../../../../queries/useGetEventPublic.ts";
import {CheckoutContent} from "../../../../../layouts/Checkout/CheckoutContent";
import {HomepageInfoMessage} from "../../../../../common/HomepageInfoMessage";
import {t} from "@lingui/macro";
import {eventHomepagePath} from "../../../../../../utilites/urlHelper.ts";
import {Event} from "../../../../../../types.ts";

interface NeemPaymentMethodProps {
    enabled: boolean;
    setSubmitHandler: (submitHandler: () => () => Promise<void>) => void;
}

export const NeemPaymentMethod = ({enabled, setSubmitHandler}: NeemPaymentMethodProps) => {
    const {eventId, orderShortId} = useParams();
    const {
        error: neemPaymentIntentError,
        isFetching: isNeemFetching,
        refetch: createNeemPaymentIntent,
    } = useCreateNeemPaymentIntent(eventId, orderShortId, false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const {data: event} = useGetEventPublic(eventId);

    const handleNeemSubmit = useCallback(async () => {
        const {data} = await createNeemPaymentIntent();
        if (!data?.redirect_url) {
            return;
        }

        setIsRedirecting(true);
        window.location.href = data.redirect_url;
    }, [createNeemPaymentIntent]);

    useEffect(() => {
        if (enabled) {
            setSubmitHandler(() => handleNeemSubmit);
        }
    }, [enabled, handleNeemSubmit, setSubmitHandler]);

    if (!enabled) {
        return (
            <CheckoutContent>
                <HomepageInfoMessage
                    status="warning"
                    message={t`Neem payments are not enabled for this event.`}
                    link={eventHomepagePath(event as Event)}
                    linkText={t`Return to event page`}
                />
            </CheckoutContent>
        );
    }

    if (neemPaymentIntentError && event) {
        return (
            <CheckoutContent>
                <HomepageInfoMessage
                    status="error"
                    /* @ts-ignore */
                    message={neemPaymentIntentError.response?.data?.message || t`Sorry, something has gone wrong. Please restart the checkout process.`}
                    link={eventHomepagePath(event)}
                    linkText={t`Return to event page`}
                />
            </CheckoutContent>
        );
    }

    if (isNeemFetching || isRedirecting) {
        return (
            <HomepageInfoMessage
                status="processing"
                message={t`Redirecting you to the payment page...`}
            />
        );
    }

    return (
        <HomepageInfoMessage
            status="awaiting_payment"
            message={t`Pay securely with Neem.`}
            subtitle={t`You will be redirected to Neem to complete your payment.`}
        />
    );
}
