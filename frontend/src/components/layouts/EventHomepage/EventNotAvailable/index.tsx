import {t} from '@lingui/macro';
import {IconCalendarPlus} from '@tabler/icons-react';
import {GenericErrorPage} from "../../../common/GenericErrorPage";
import {isHiEvents} from "../../../../utilites/helpers.ts";

const REGISTER_URL = "https://app.urbanevents.pk/auth/register?utm_source=app.urbanevents.pk&utm_content=event-not-available/create-event";

export const EventNotAvailable = () => {
    return (
        <GenericErrorPage
            title={t`Event Not Available`}
            description={t`The event you're looking for is not available at the moment. It may have been removed, expired, or the URL might be incorrect.`}
            pageTitle={t`Event Not Available`}
            metaDescription={t`The event you're looking for is not available at the moment. It may have been removed, expired, or the URL might be incorrect.`}
            buttonText={isHiEvents() ? t`Create your own event` : undefined}
            buttonUrl={isHiEvents() ? REGISTER_URL : undefined}
            buttonIcon={<IconCalendarPlus size={18}/>}
        />
    );
};

export default EventNotAvailable;
