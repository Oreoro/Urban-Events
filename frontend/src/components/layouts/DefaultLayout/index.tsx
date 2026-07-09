import {Outlet} from "react-router";
import {Header} from "../../common/Header";
import {Container} from "@mantine/core";
import {GlobalMenu} from "../../common/GlobalMenu";
import ImpersonationBanner from "../../common/ImpersonationBanner";
import {AuthGuard} from "../../common/AuthGuard";
import classes from './DefaultLayout.module.scss';

const DefaultLayoutContent = () => {
    return (
        <>
            <ImpersonationBanner />
            <Header rightContent={<GlobalMenu/>} fullWidth/>
            <main className={classes.main}>
                <Container size="xl" p={0} className={classes.content}>
                    <Outlet/>
                </Container>
            </main>
        </>
    );
}

const DefaultLayout = () => (
    <AuthGuard>
        <DefaultLayoutContent/>
    </AuthGuard>
);

export default DefaultLayout;
