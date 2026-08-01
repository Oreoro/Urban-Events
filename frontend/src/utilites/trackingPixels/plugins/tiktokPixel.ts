/* eslint-disable lingui/no-unlocalized-strings */
import {TrackingPixelPlugin, TrackingEventData} from '../types';

interface TikTokPixelTarget {
    [method: string]: unknown;
    push(command: unknown[]): unknown;
}

interface TikTokPixelQueue extends TikTokPixelTarget {
    methods: string[];
    setAndDefer(target: TikTokPixelTarget, method: string): void;
    instance(id: string): TikTokPixelTarget;
    load(id: string): void;
    page(): void;
    track(eventName: string, data: Record<string, unknown>): void;
    _i: Record<string, TikTokPixelTarget>;
    _t: Record<string, unknown>;
}

declare global {
    interface Window {
        ttq?: TikTokPixelQueue;
        TiktokAnalyticsObject?: string;
    }
}

export const tiktokPixelPlugin: TrackingPixelPlugin = {
    name: 'tiktok_pixel',

    initialize(pixelId: string) {
        if (typeof window === 'undefined' || window.ttq) return;

        const ttq = window.ttq ?? ([] as unknown as TikTokPixelQueue);
        window.ttq = ttq;
        ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
        ttq.setAndDefer = function (t: TikTokPixelTarget, e: string) {
            t[e] = function (...args: unknown[]) {
                t.push([e, ...args]);
            };
        };
        for (const method of ttq.methods) {
            ttq.setAndDefer(ttq, method);
        }
        ttq.instance = function (id: string) {
            const instance = ttq._i[id] ?? ([] as unknown as TikTokPixelTarget);
            ttq._i[id] = instance;
            for (const method of ttq.methods) {
                ttq.setAndDefer(instance, method);
            }
            return instance;
        };
        ttq.load = function (id: string) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.src = 'https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=' + encodeURIComponent(id) + '&lib=ttq';
            script.dataset.trackingPixel = 'tiktok';
            document.head.appendChild(script);
        };
        ttq._i = ttq._i || {};
        ttq._t = ttq._t || {};

        ttq.load(pixelId);
        ttq.page();
    },

    pageView() {
        window.ttq?.page();
    },

    trackEvent(data: TrackingEventData) {
        const eventMap: Record<string, string> = {
            'ViewContent': 'ViewContent',
            'InitiateCheckout': 'InitiateCheckout',
            'Purchase': 'CompletePayment',
        };
        const ttEvent = eventMap[data.eventName] || data.eventName;
        window.ttq?.track(ttEvent, {
            value: data.value,
            currency: data.currency,
            content_name: data.contentName,
            content_id: data.contentId ? String(data.contentId) : undefined,
        });
    },

    cleanup() {
        document.querySelectorAll('script[data-tracking-pixel="tiktok"]').forEach(el => el.remove());
        delete window.ttq;
        delete window.TiktokAnalyticsObject;
    },
};
