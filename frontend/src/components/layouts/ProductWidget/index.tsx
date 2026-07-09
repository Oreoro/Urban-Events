import {useLocation, useParams} from "react-router";
import '../../../styles/widget/default.scss';
import {useGetEventPublic} from "../../../queries/useGetEventPublic.ts";
import SelectProducts from "../../routes/product-widget/SelectProducts";
import {useMemo} from "react";
import {Loader} from "@mantine/core";
import {URBAN_EVENTS_THEME} from "../../../utilites/themeUtils.ts";

const DEFAULT_WIDGET_TEXT_COLOR = "#111111";

const ProductWidget = () => {
    const {eventId} = useParams();
    const location = useLocation();
    const eventQuery = useGetEventPublic(eventId);

    const settings = useMemo(() => {
        const searchParams = new URLSearchParams(location.search);

        return {
            colors: {
                background: searchParams.get("BackgroundColor") || URBAN_EVENTS_THEME.background,
                primary: searchParams.get("PrimaryColor") || DEFAULT_WIDGET_TEXT_COLOR,
                primaryText: searchParams.get("PrimaryTextColor") || DEFAULT_WIDGET_TEXT_COLOR,
                secondary: searchParams.get("SecondaryColor") || URBAN_EVENTS_THEME.accent,
                secondaryText: searchParams.get("SecondaryTextColor") || URBAN_EVENTS_THEME.accentContrast,
                bodyBackground: searchParams.get("BackgroundColor") || URBAN_EVENTS_THEME.background,
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
