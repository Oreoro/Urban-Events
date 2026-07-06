# Image Display Troubleshooting Guide

## Problem
You can't see images on your frontend because the application is configured to use Azure Storage for image storage, but the frontend doesn't have the proper configuration and authentication.

## Solution

### Step 1: Set Environment Variables at Runtime
Your application injects environment variables at runtime through the server. Since your container is already public, you only need these basic settings:

```bash
# Azure Storage Configuration (Container is already public)
export VITE_AZURE_STORAGE_URL=https://urbanevents.blob.core.windows.net
export VITE_AZURE_STORAGE_CONTAINER=urbanevents
export VITE_AZURE_STORAGE_PUBLIC_ACCESS=true

# App Configuration
export VITE_APP_NAME="Urban Events"
export VITE_APP_PRIMARY_COLOR=#37352F
export VITE_APP_SECONDARY_COLOR=#FBFBFA
export VITE_APP_FAVICON=/manifest-icons/favicon.svg
export VITE_APP_LOGO_DARK=/logos/urban-events-text-dark.svg
export VITE_APP_LOGO_LIGHT=/logos/urban-events-text-light.svg
export VITE_DEFAULT_IMAGE_URL=/images/event-thumb-1.jpg
export VITE_API_URL_CLIENT=http://localhost:8000/api
export VITE_API_URL_SERVER=http://localhost:8000/api
export VITE_FRONTEND_URL=http://localhost:5678

# Then start your server
cd frontend
npm run dev:csr
```

### Step 2: Azure Storage Authentication (Public Container)
Since your container is already public, you don't need SAS tokens:

✅ **Public Container Access (Already Configured)**
- Your `urbanevents` container has public read access
- No authentication needed for image downloads
- Set `VITE_AZURE_STORAGE_PUBLIC_ACCESS=true`

❌ **SAS Token (Not Needed)**
- Only required if container is private
- More complex to manage
- Not necessary for your setup

### Step 3: How Runtime Environment Variables Work
Your `server.js` automatically injects all `VITE_*` environment variables into the HTML:

```javascript
// This happens automatically in server.js
const envVariablesHtml = `<script>window.hievents = ${getViteEnvironmentVariables()};</script>`;
```

The frontend then accesses these through `getConfig()` which checks:
1. `window.hievents` (runtime-injected variables)
2. `import.meta.env` (build-time variables)
3. `process.env` (server-side variables)

### Step 4: Verify Azure Storage Configuration
Make sure your backend has the correct Azure Storage configuration in `backend/config/filesystems.php`:

```php
'azure' => [
    'driver' => 'azure-storage-blob',
    'connection_string' => env('AZURE_STORAGE_CONNECTION_STRING'),
    'container' => env('AZURE_STORAGE_CONTAINER'),
    'url' => env('AZURE_STORAGE_URL'),
    'visibility' => 'public',
    'throw' => false,
],
```

### Step 5: Check Backend Environment Variables
Ensure your backend has these environment variables set:

```bash
AZURE_STORAGE_CONNECTION_STRING=your_connection_string
AZURE_STORAGE_CONTAINER=urbanevents
AZURE_STORAGE_URL=https://urbanevents.blob.core.windows.net
FILESYSTEM_PUBLIC_DISK=azure
FILESYSTEM_PRIVATE_DISK=azure
```

## How It Works

1. **Server**: Reads environment variables and injects them into `window.hievents`
2. **Frontend**: Accesses these through `getConfig()` function
3. **Public Access**: Since container is public, no authentication needed
4. **Image URLs**: Are automatically constructed using Azure Storage configuration
5. **Runtime**: All configuration happens at server startup, no build required

## Testing

1. **Check Environment Variables**: Look at the HTML source for `window.hievents`
2. **Test Image Upload**: Upload an image and check the Network tab
3. **Verify URLs**: Image URLs should point to Azure Storage without authentication
4. **Check Access**: Images should load directly from Azure Storage

## Common Issues

- **Missing environment variables**: Set them when starting the server
- **Wrong Azure Storage URL**: Verify in Azure portal
- **Container permissions**: Your container is already public, so this should work
- **CORS issues**: Configure CORS in Azure Storage if needed

## Example Server Startup

```bash
# Option 1: Export variables then start
export VITE_AZURE_STORAGE_URL=https://urbanevents.blob.core.windows.net
export VITE_AZURE_STORAGE_CONTAINER=urbanevents
export VITE_AZURE_STORAGE_PUBLIC_ACCESS=true
npm run dev:csr

# Option 2: Inline variables
VITE_AZURE_STORAGE_URL=https://urbanevents.blob.core.windows.net \
VITE_AZURE_STORAGE_CONTAINER=urbanevents \
VITE_AZURE_STORAGE_PUBLIC_ACCESS=true \
npm run dev:csr
```

## Additional Notes

- **No `.env` file needed** - variables are injected at runtime
- **Container is already public** - no authentication complexity
- **Connection strings** - only needed for backend uploads
- **Frontend only needs** - URL, container, and public access flag
- **Simple setup** - just 3 environment variables for Azure Storage
