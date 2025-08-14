import {Event, IdParam, ImageType, Organizer, Image} from "../types.ts";
import {getConfig} from "./config.ts";
import {getAzureStorageUrl, getDefaultImageUrl} from "./azureStorage.ts";

export const eventCheckoutPath = (eventId: IdParam, orderShortId: IdParam, subPage = '') => {
    return `/checkout/${eventId}/${orderShortId}/${subPage}`;
}

export const eventPreviewPath = (eventId: IdParam) => {
    return `/event/${eventId}/preview`;
}

export const eventHomepagePath = (event: Event) => {
    return `/event/${event?.id}/${event?.slug}`;
}

export const organizerHomepagePath = (organizer: Organizer) => {
    return `/events/${organizer?.id}/${organizer?.slug}`;
}

export const organizerHomepageUrl = (organizer: Organizer) => {
    return getConfig('VITE_FRONTEND_URL') + organizerHomepagePath(organizer);
}

export const eventHomepageUrl = (event: Event) => {
    return getConfig('VITE_FRONTEND_URL') + eventHomepagePath(event);
}

export const eventCoverImageUrl = (event: Event) => {
    return event?.images?.find((image) => image.type === 'EVENT_COVER')?.url;
}

export const imageUrl = (imageType: ImageType, images?: Image[], fallbackUrl?: string) => {
    if (!images || images.length === 0) {
        return fallbackUrl || getDefaultImageUrl();
    }

    const image = images.find((img) => img.type === imageType);
    if (image) {
        // If the image URL is from Azure Storage, return as is
        // Otherwise, construct the full Azure Storage URL
        if (image.url && (image.url.startsWith('http://') || image.url.startsWith('https://'))) {
            return image.url;
        }
        return getAzureStorageUrl(image.url || '');
    }
    return fallbackUrl || getDefaultImageUrl();
}

export const organizerPreviewPath = (organizerId: IdParam) => {
    return `/organizer/${organizerId}/preview`;
}
