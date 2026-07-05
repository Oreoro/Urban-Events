import classes from './Header.module.scss'
import { FC } from 'react';
import { Event } from '../../../../types.ts';
import {getImageUrl} from "../../../../utilites/urlHelper.ts";

export const Header: FC<{
    event: Event
}> = ({ event }) => {

    const coverImage = event?.images?.find((image) => image.type === 'EVENT_COVER');
    const coverImageUrl = getImageUrl(coverImage);

    if (!coverImageUrl) {
        return <></>;
    }

    return (
        <>
            <header className={classes.header}>
                <img
                    style={{maxWidth: '1000px'}}
                    alt={event?.title}
                    src={coverImageUrl}
                />
            </header>
        </>
    )
}
