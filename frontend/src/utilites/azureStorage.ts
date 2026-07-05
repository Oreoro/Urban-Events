import {getConfig} from "./config.ts";

/**
 * Azure Storage utility functions for handling image URLs
 */

const trimSlashes = (value: string): string => value.replace(/^\/+|\/+$/g, '');

const appendSasToken = (url: string): string => {
    const sasToken = getConfig('VITE_AZURE_STORAGE_SAS_TOKEN');
    if (!sasToken) {
        return url;
    }

    const token = sasToken.replace(/^\?/, '');
    if (!token || url.includes(token)) {
        return url;
    }

    return `${url}${url.includes('?') ? '&' : '?'}${token}`;
};

const getAzureStorageBaseUrl = (): string => {
    const configuredUrl = getConfig('VITE_AZURE_STORAGE_URL', 'https://urbanevents.blob.core.windows.net') || 'https://urbanevents.blob.core.windows.net';
    const container = trimSlashes(getConfig('VITE_AZURE_STORAGE_CONTAINER', 'urbanevents') || '');
    const baseUrl = configuredUrl.replace(/\/+$/, '');

    try {
        const url = new URL(baseUrl);
        const path = trimSlashes(url.pathname);

        if (!path && container) {
            url.pathname = `/${container}`;
        }

        return url.toString().replace(/\/+$/, '');
    } catch {
        return container ? `${baseUrl}/${container}` : baseUrl;
    }
};

export const normalizeAzureStorageUrl = (imageUrl: string): string => {
    if (!imageUrl || !isAzureStorageUrl(imageUrl)) {
        return imageUrl;
    }

    try {
        const source = new URL(imageUrl);
        const base = new URL(getAzureStorageBaseUrl());

        if (source.hostname !== base.hostname) {
            return imageUrl;
        }

        const baseSegments = base.pathname.split('/').filter(Boolean);
        const sourceSegments = source.pathname.split('/').filter(Boolean);

        if (baseSegments.length > 0 && sourceSegments[0] !== baseSegments[0]) {
            source.pathname = `/${[...baseSegments, ...sourceSegments].join('/')}`;
        }

        return appendSasToken(source.toString());
    } catch {
        return imageUrl;
    }
};

/**
 * Constructs a full Azure Storage URL for an image with authentication
 * @param imagePath - The relative path or full URL of the image
 * @returns The full Azure Storage URL with authentication
 */
export const getAzureStorageUrl = (imagePath: string): string => {
    if (!imagePath) {
        return imagePath;
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return normalizeAzureStorageUrl(imagePath);
    }

    return appendSasToken(`${getAzureStorageBaseUrl()}/${trimSlashes(imagePath)}`);
};

/**
 * Checks if a URL is an Azure Storage URL
 * @param url - The URL to check
 * @returns True if it's an Azure Storage URL
 */
export const isAzureStorageUrl = (url: string): boolean => {
    return url.includes('blob.core.windows.net');
};

/**
 * Gets the default image URL from Azure Storage
 * @returns The default image URL
 */
export const getDefaultImageUrl = (): string => {
    return getAzureStorageUrl('images/event-thumb-1.jpg');
};

/**
 * Checks if Azure Storage is properly configured
 * @returns True if Azure Storage is configured
 */
export const isAzureStorageConfigured = (): boolean => {
    const url = getConfig('VITE_AZURE_STORAGE_URL');
    const container = getConfig('VITE_AZURE_STORAGE_CONTAINER');
    const sasToken = getConfig('VITE_AZURE_STORAGE_SAS_TOKEN');
    const isPublic = getConfig('VITE_AZURE_STORAGE_PUBLIC_ACCESS') === 'true';
    
    return !!(url && container && (sasToken || isPublic));
}; 
