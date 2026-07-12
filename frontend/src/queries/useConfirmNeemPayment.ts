import {useQuery} from "@tanstack/react-query";
import {orderClientPublic} from "../api/order.client.ts";
import {IdParam} from "../types.ts";

export const GET_CONFIRM_NEEM_PAYMENT_PUBLIC_QUERY_KEY = 'getNeemConfirmPaymentPublic';

export const useConfirmNeemPayment = (
    eventId: IdParam,
    orderShortId: IdParam,
    status: any,
    transactionId: string | null,
    basketId: string | null
) => {
    return useQuery({
        queryKey: [
            GET_CONFIRM_NEEM_PAYMENT_PUBLIC_QUERY_KEY,
            eventId,
            orderShortId,
            status,
            transactionId,
            basketId
        ],
        queryFn: async () => {
            const response = await orderClientPublic.createNeemConfirmPayment(
                Number(eventId),
                String(orderShortId),
                String(status),
                String(transactionId),
                String(basketId)
            );
            return { success: response.success };
        },
        enabled: Boolean(eventId && orderShortId && status && transactionId && basketId),
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 0,
        gcTime: 0
    });
};
