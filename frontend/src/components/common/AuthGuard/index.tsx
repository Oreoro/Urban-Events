import {Center, Loader} from "@mantine/core";
import {PropsWithChildren, useEffect} from "react";
import {Navigate, useLocation} from "react-router";
import {PREVIOUS_URL_KEY} from "../../../api/client.ts";
import {useGetMe} from "../../../queries/useGetMe.ts";

interface AuthGuardProps {
    requireSuperAdmin?: boolean;
}

export const AuthGuard = ({
    children,
    requireSuperAdmin = false,
}: PropsWithChildren<AuthGuardProps>) => {
    const location = useLocation();
    const me = useGetMe();
    const shouldRedirectToLogin = me.isFetched && (me.isError || !me.data);
    const shouldRedirectHome = me.isFetched
        && requireSuperAdmin
        && me.data?.role !== 'SUPERADMIN';

    useEffect(() => {
        if (!shouldRedirectToLogin || typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem(PREVIOUS_URL_KEY, window.location.href);
    }, [shouldRedirectToLogin]);

    if (!me.isFetched) {
        return (
            <Center mih="100vh">
                <Loader color="secondary" size="sm"/>
            </Center>
        );
    }

    if (shouldRedirectToLogin) {
        return <Navigate to={`/auth/login${location.search}`} replace/>;
    }

    if (shouldRedirectHome) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};
