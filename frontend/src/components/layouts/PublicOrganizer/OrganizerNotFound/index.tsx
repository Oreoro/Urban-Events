import {t} from '@lingui/macro';
import {IconCalendarPlus} from '@tabler/icons-react';
import {GenericErrorPage} from "../../../common/GenericErrorPage";

const REGISTER_URL = "https://app.urbanevents.pk/auth/register?utm_source=app.urbanevents.pk&utm_content=organizer-not-found/create-event";

export const OrganizerNotFound = () => {
    return (
        <GenericErrorPage
            title={t`Organizer Not Found`}
            description={t`The organizer you're looking for could not be found. The page may have been moved, deleted, or the URL might be incorrect.`}
            pageTitle={t`Organizer Not Found`}
            metaDescription={t`The organizer you're looking for could not be found. The page may have been moved, deleted, or the URL might be incorrect.`}
            buttonText={t`Create your own event`}
            buttonUrl={REGISTER_URL}
            buttonIcon={<IconCalendarPlus size={18}/>}
        >

        </GenericErrorPage>
    );
};

export default OrganizerNotFound;
