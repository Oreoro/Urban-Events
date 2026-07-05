import {useQuery} from "@tanstack/react-query";
import {User} from "../types.ts";
import {userClient} from "../api/user.client.ts";

export const GET_ME_QUERY_KEY = 'getGetMe';

interface UseGetMeOptions {
    enabled?: boolean;
}

export const useGetMe = (options: UseGetMeOptions = {}) => {
    return useQuery<User>({
        queryKey: [GET_ME_QUERY_KEY],

        queryFn: async () => {
            const {data} = await userClient.me();
            return data;
        },

        retry: false,
        enabled: options.enabled ?? true,
    });
};
