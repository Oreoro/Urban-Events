import {useLocation, useParams} from "react-router";
import '../../../styles/widget/default.scss';
import {useGetEventPublic} from "../../../queries/useGetEventPublic.ts";
import SelectProducts from "../../routes/product-widget/SelectProducts";
import {useMemo} from "react";
import {Loader} from "@mantine/core";

const ProductWidget = () => {
    const {eventId} = useParams();
    const location = useLocation();
    const eventQuery = useGetEventPublic(eventId);

    const settings = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            colors: {
                background: searchParams.get("BackgroundColor") || '#F7F7F5',
                primary: searchParams.get("PrimaryColor") || '#37352F',
                primaryText: searchParams.get("PrimaryTextColor") || '#37352F',
                secondary: searchParams.get("SecondaryColor") || '#37352F',
                secondaryText: searchParams.get("SecondaryTextColor") || '#FFFFFF',
                bodyBackground: searchParams.get("BackgroundColor") || '#F7F7F5',
            },
            continueButtonText: searchParams.get("ContinueButtonText") || 'Continue',
            padding: searchParams.get("Padding") || '10px',
        };
    }, [location.search]);

    if (!eventQuery.isFetched || !eventQuery.data) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: settings.colors.background
            }}>
                <Loader color={settings.colors.primaryText} size="md" type="dots"/>
            </div>
        )
    }

    return (
        <div className={'full-height'} style={{backgroundColor: settings.colors.bodyBackground}}>
            <SelectProducts
                widgetMode={'embedded'}
                event={eventQuery.data}
                colors={settings.colors}
                continueButtonText={settings.continueButtonText}
                padding={settings.padding}
            />
        </div>
    );
};

export default ProductWidget;
