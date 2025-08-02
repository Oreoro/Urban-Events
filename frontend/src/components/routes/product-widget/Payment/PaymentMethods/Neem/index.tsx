import {useParams} from "react-router";
import {useCreateNeemPaymentIntent} from "../../../../../../queries/useCreateNeemPaymentIntent.ts";
import {useEffect, useState} from "react";
import {useGetEventPublic} from "../../../../../../queries/useGetEventPublic.ts";
import {CheckoutContent} from "../../../../../layouts/Checkout/CheckoutContent";
import {HomepageInfoMessage} from "../../../../../common/HomepageInfoMessage";
import {t} from "@lingui/macro";
import {eventHomepagePath} from "../../../../../../utilites/urlHelper.ts";
import {LoadingMask} from "../../../../../common/LoadingMask";
import {Event} from "../../../../../../types.ts";

interface NeemPaymentMethodProps {
    enabled: boolean;
    setSubmitHandler: (submitHandler: () => () => Promise<void>) => void;
}

export const NeemPaymentMethod = ({enabled, setSubmitHandler}: NeemPaymentMethodProps) => {
    const {eventId, orderShortId} = useParams();
    const {
        data: neemData,
        isFetched: isNeemFetched,
        error: neemPaymentIntentError
    } = useCreateNeemPaymentIntent(eventId, orderShortId);
    const [neemPromise, setNeemPromise] = useState(false);
    const {data: event} = useGetEventPublic(eventId);

    useEffect(() => {
        if (!neemData?.redirect_url) {
            return;
        }

        const neemRedirectUrl = neemData?.redirect_url;
        // const options = neemSecretToken ? {
        //     neemSecretToken: neemSecretToken
        // } : {};

        setNeemPromise(neemRedirectUrl);
    }, [neemData]);

    useEffect(() => {
        if (isNeemFetched) {
            // console.log(neemData.redirect_url);
            window.location.href = neemData.redirect_url
        }
    }, [isNeemFetched, neemData]);

    if (!enabled) {
        return (
            <CheckoutContent>
                <HomepageInfoMessage
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
                    /* @ts-ignore */
                    message={neemPaymentIntentError.response?.data?.message || t`Sorry, something has gone wrong. Please restart the checkout process.`}
                    link={eventHomepagePath(event)}
                    linkText={t`Return to event page`}
                />
            </CheckoutContent>
        );
    }

    if (!isNeemFetched) {
        return <LoadingMask/>;
    }

    return (
        <>
            {(!neemPromise) && <LoadingMask/>}

            {(isNeemFetched) && (
                <CheckoutContent>
                    <HomepageInfoMessage
                        message={t`Redirecting you to the payment page...`}
                        link={neemPromise}
                        linkText={t`Click here if not redirected`}
                    />
                </CheckoutContent>
            )}
        </>
    );
}
