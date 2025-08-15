import {getConfig} from "./config.ts";

/**
 * Azure Storage utility functions for handling image URLs
 */

/**
 * Constructs a full Azure Storage URL for an image with authentication
 * @param imagePath - The relative path or full URL of the image
 * @returns The full Azure Storage URL with authentication
 */
export const getAzureStorageUrl = (imagePath: string): string => {
    const azureStorageUrl = getConfig('VITE_AZURE_STORAGE_URL', 'https://urbanevents.blob.core.windows.net/urbanevents');
    const azureStorageContainer = getConfig('VITE_AZURE_STORAGE_CONTAINER', 'urbanevents');
    const sasToken = getConfig('VITE_AZURE_STORAGE_SAS_TOKEN');
    const isPublicAccess = getConfig('VITE_AZURE_STORAGE_PUBLIC_ACCESS') === 'true';
    
  
  // If it's a relative path, construct the full Azure Storage URL
    if (imagePath.startsWith('/')) {
        imagePath = imagePath.substring(1); // Remove leading slash
    }
    
    let fullUrl = `${azureStorageUrl}/${azureStorageContainer}/${imagePath}`;
    console.log("Constructed Blob URL:", fullUrl);
    
    // Add SAS token if provided
    if (sasToken) {
        fullUrl += sasToken;
    }
    
    return fullUrl;
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
