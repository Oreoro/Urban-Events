import {useQuery} from "@tanstack/react-query";
import {orderClientPublic} from "../api/order.client.ts";
import {IdParam} from "../types.ts";

export const GET_INITIATE_NEEM_SESSION_PUBLIC_QUERY_KEY = 'getNeemSessionPublic';

export const useCreateNeemPaymentIntent = (eventId: IdParam, orderShortId: IdParam, enabled = true) => {
    return useQuery({
        queryKey: [GET_INITIATE_NEEM_SESSION_PUBLIC_QUERY_KEY, eventId, orderShortId],

        queryFn: async () => {
            const {redirect_url} = await orderClientPublic.createNeemPaymentIntent(
                Number(eventId),
                String(orderShortId),
            );
            return {redirect_url};
        },

        enabled,
        retry: false,
        staleTime: 0,
        gcTime: 0
    });
}
