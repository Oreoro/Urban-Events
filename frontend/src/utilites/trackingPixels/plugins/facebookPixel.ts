/* eslint-disable lingui/no-unlocalized-strings */
import {TrackingPixelPlugin, TrackingEventData} from '../types';

interface FacebookPixelQueue {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    push: FacebookPixelQueue;
    loaded: boolean;
    version: string;
    queue: unknown[][];
}

declare global {
    interface Window {
        fbq?: FacebookPixelQueue;
        _fbq?: FacebookPixelQueue;
    }
}

function fbq(...args: unknown[]) {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq(...args);
    }
}

export const facebookPixelPlugin: TrackingPixelPlugin = {
    name: 'facebook_pixel',

    initialize(pixelId: string) {
        if (typeof window === 'undefined' || window.fbq) return;

        const pixel = function (...args: unknown[]) {
            if (pixel.callMethod) {
                pixel.callMethod(...args);
            } else {
                pixel.queue.push(args);
            }
        } as FacebookPixelQueue;
        pixel.push = pixel;
        pixel.loaded = true;
        pixel.version = '2.0';
        pixel.queue = [];
        window.fbq = pixel;
        window._fbq ??= pixel;

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        script.dataset.trackingPixel = 'facebook';
        document.head.appendChild(script);

        fbq('init', pixelId);
    },

    pageView() {
        fbq('track', 'PageView');
    },

    trackEvent(data: TrackingEventData) {
        const eventMap: Record<string, string> = {
            'ViewContent': 'ViewContent',
            'InitiateCheckout': 'InitiateCheckout',
            'Purchase': 'Purchase',
        };
        const fbEvent = eventMap[data.eventName] || data.eventName;
        fbq('track', fbEvent, {
            value: data.value || 0,
            currency: data.currency || 'USD',
            content_name: data.contentName,
            content_ids: data.contentId ? [String(data.contentId)] : undefined,
        });
    },

    cleanup() {
        document.querySelectorAll('script[data-tracking-pixel="facebook"]').forEach(el => el.remove());
        delete window.fbq;
        delete window._fbq;
    },
};
