import {Outlet} from "react-router";
import {Header} from "../../common/Header";
import {Container} from "@mantine/core";
import {GlobalMenu} from "../../common/GlobalMenu";
import ImpersonationBanner from "../../common/ImpersonationBanner";
import {AuthGuard} from "../../common/AuthGuard";

const DefaultLayoutContent = () => {
    return (
        <>
            <ImpersonationBanner />
            <Header rightContent={<GlobalMenu/>}/>
            <Container>
                <Outlet/>
            </Container>
        </>
    );
}

const DefaultLayout = () => (
    <AuthGuard>
        <DefaultLayoutContent/>
    </AuthGuard>
);

export default DefaultLayout;
