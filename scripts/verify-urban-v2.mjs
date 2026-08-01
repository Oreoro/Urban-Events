import {readFile, access} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');

const requireFile = async (relativePath) => {
    try {
        await access(path.join(root, relativePath));
    } catch {
        failures.push(`${relativePath}: required file is missing`);
    }
};

const requireText = async (relativePath, expectedValues) => {
    const content = await read(relativePath);
    for (const expected of expectedValues) {
        if (!content.includes(expected)) {
            failures.push(`${relativePath}: missing ${JSON.stringify(expected)}`);
        }
    }
};

const rootVersion = (await read('VERSION')).trim();
const backendVersion = (await read('backend/VERSION')).trim();
const frontendPackage = JSON.parse(await read('frontend/package.json'));
const backendComposer = JSON.parse(await read('backend/composer.json'));
const backendComposerLock = JSON.parse(await read('backend/composer.lock'));
const lockedBackendPackages = new Set(
    (backendComposerLock.packages ?? []).map(({name}) => name),
);

if (rootVersion !== backendVersion || rootVersion !== frontendPackage.version) {
    failures.push(
        `version mismatch: root=${rootVersion}, backend=${backendVersion}, frontend=${frontendPackage.version}`,
    );
}

if (!backendComposer.require?.['azure-oss/storage-blob-laravel']) {
    failures.push('backend/composer.json: maintained Azure Blob Laravel adapter is required');
}

if (backendComposer.require?.['matthewbdaly/laravel-azure-storage']) {
    failures.push('backend/composer.json: obsolete Azure Blob Laravel adapter must stay removed');
}

if (!lockedBackendPackages.has('azure-oss/storage-blob-laravel')) {
    failures.push('backend/composer.lock: maintained Azure Blob Laravel adapter is missing');
}

for (const obsoletePackage of [
    'league/flysystem-azure-blob-storage',
    'matthewbdaly/laravel-azure-storage',
    'microsoft/azure-storage-blob',
    'microsoft/azure-storage-common',
]) {
    if (lockedBackendPackages.has(obsoletePackage)) {
        failures.push(`backend/composer.lock: obsolete package ${obsoletePackage} must stay removed`);
    }
}

await requireText('backend/config/app.php', [
    "env('APP_NAME', 'Urban Events')",
    "'default_timezone' => 'Asia/Karachi'",
    "'default_currency_code' => 'PKR'",
]);
await requireText('backend/config/filesystems.php', [
    "'driver' => 'azure-storage-blob'",
]);
await requireText('backend/app/DomainObjects/Enums/PaymentProviders.php', [
    "case NEEM = 'NEEM'",
]);
await requireText('backend/app/Services/Domain/Event/CreateEventService.php', [
    'PaymentProviders::NEEM->value',
]);
await requireText('backend/routes/api.php', [
    '/neem/generate_token',
    '/neem/confirm_payment',
]);
await requireText('frontend/src/App.tsx', [
    'getUrbanEventsTheme()',
    'getConfig("VITE_APP_NAME", "Urban Events")',
]);
await requireText('frontend/src/components/routes/product-widget/Payment/index.tsx', [
    "includes('NEEM')",
    '<NeemPaymentMethod',
]);
await requireText('frontend/src/components/layouts/AuthLayout/index.tsx', [
    '/logos/urban-events-text-dark.svg',
    'Local Neem payments',
    'PKR 2,500',
]);

for (const relativePath of [
    'frontend/public/logos/urban-events-icon.svg',
    'frontend/public/logos/urban-events-text-dark.svg',
    'frontend/public/logos/urban-events-text-light.svg',
    'backend/database/migrations/2026_02_22_000002_create_event_occurrences_table.php',
    'backend/database/migrations/2026_02_22_000006_backfill_occurrences_and_drop_event_dates.php',
    'backend/app/Http/Actions/Orders/Payment/Neem/CreateNeemPaymentIntentActionPublic.php',
    'backend/app/Http/Actions/Orders/Payment/Neem/CreateNeemPaymentConfirmationActionPublic.php',
]) {
    await requireFile(relativePath);
}

if (failures.length > 0) {
    console.error('Urban Events v2 invariant verification failed:');
    for (const failure of failures) {
        console.error(`- ${failure}`);
    }
    process.exitCode = 1;
} else {
    console.log(`Urban Events v2 invariants verified for ${rootVersion}.`);
}
