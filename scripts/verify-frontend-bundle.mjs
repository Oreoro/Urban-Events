import {access, readFile, readdir, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frontendDist = path.join(root, 'frontend', 'dist');
const KB = 1000;

const exists = async (filePath) => {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
};

const clientRoot = await exists(path.join(frontendDist, 'client', 'index.html'))
    ? path.join(frontendDist, 'client')
    : frontendDist;
const assetsRoot = path.join(clientRoot, 'assets');
const indexHtmlPath = path.join(clientRoot, 'index.html');

if (!await exists(indexHtmlPath) || !await exists(assetsRoot)) {
    console.error('Frontend bundle verification requires a completed production client build.');
    process.exit(1);
}

const files = await readdir(assetsRoot);
const jsFiles = files.filter((file) => file.endsWith('.js'));
const sizes = new Map(
    await Promise.all(jsFiles.map(async (file) => [file, (await stat(path.join(assetsRoot, file))).size])),
);
const failures = [];

const requireChunk = (prefix, maxBytes) => {
    const matches = jsFiles.filter((file) => file.startsWith(prefix));

    if (matches.length !== 1) {
        failures.push(`${prefix} expected one chunk, found ${matches.length}`);
        return;
    }

    const [file] = matches;
    const size = sizes.get(file);
    if (size > maxBytes) {
        failures.push(`${file} is ${(size / KB).toFixed(2)} kB; budget is ${maxBytes / KB} kB`);
    }
};

requireChunk('vendor-react-', 550 * KB);
requireChunk('vendor-router-', 125 * KB);
requireChunk('vendor-data-', 125 * KB);

for (const [file, size] of sizes) {
    if (size > 550 * KB) {
        failures.push(`${file} is ${(size / KB).toFixed(2)} kB; maximum chunk budget is 550 kB`);
    }
}

const indexHtml = await readFile(indexHtmlPath, 'utf8');
const entryMatch = indexHtml.match(/<script[^>]+type="module"[^>]+src="([^"]+\.js)"/);

if (!entryMatch) {
    failures.push('index.html does not contain a production module entry');
} else {
    const entryFile = path.basename(entryMatch[1]);
    const entrySize = sizes.get(entryFile);

    if (!entrySize) {
        failures.push(`entry chunk ${entryFile} is missing from the assets directory`);
    } else if (entrySize > 350 * KB) {
        failures.push(`${entryFile} is ${(entrySize / KB).toFixed(2)} kB; entry budget is 350 kB`);
    }
}

if (failures.length > 0) {
    console.error('Frontend bundle verification failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
}

const entryFile = path.basename(entryMatch[1]);
console.log(
    `Frontend bundle budgets verified: entry ${(sizes.get(entryFile) / KB).toFixed(2)} kB; `
    + `largest ${(Math.max(...sizes.values()) / KB).toFixed(2)} kB.`,
);
