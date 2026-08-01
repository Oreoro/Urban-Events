import {defineConfig} from "vite";
import {lingui} from "@lingui/vite-plugin";
import react from "@vitejs/plugin-react";
import {copy} from "vite-plugin-copy";
import {existsSync, readFileSync} from "fs";
import {resolve} from "path";

function getVersion(): string {
    const candidates = [
        resolve(__dirname, "../VERSION"),
        resolve(__dirname, "../../VERSION"),
        "/app/VERSION",
    ];
    for (const path of candidates) {
        if (existsSync(path)) {
            return readFileSync(path, "utf-8").trim();
        }
    }
    return "unknown";
}

function getVendorChunk(moduleId: string): string | undefined {
    if (!moduleId.includes("node_modules")) {
        return undefined;
    }

    if (["/react/", "/react-dom/", "/scheduler/"].some((dependency) => moduleId.includes(dependency))) {
        return "vendor-react";
    }

    if (moduleId.includes("/react-router/")) {
        return "vendor-router";
    }

    if (["/axios/", "/@tanstack/query-core/", "/@tanstack/react-query/"].some((dependency) => moduleId.includes(dependency))) {
        return "vendor-data";
    }

    return undefined;
}

export default defineConfig({
    optimizeDeps: {
        include: ["react-router"]
    },
    server: {
        hmr: {
            port: 24678,
            protocol: "ws",
        },
    },
    plugins: [
        react({
            babel: {
                plugins: ["macros"],
            },
        }),
        lingui(),
        copy({
            targets: [{src: "src/embed/widget.js", dest: "public"}],
            hook: "writeBundle",
        }),
    ],
    define: {
        "process.env": process.env,
        "__APP_VERSION__": JSON.stringify(getVersion()),
    },
    ssr: {
        noExternal: ["react-helmet-async"],
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: "modern-compiler",
            }
        }
    },
    build: {
        // React 19's client runtime produces a 545 kB chunk (171 kB gzip), so
        // keep the warning threshold just above that indivisible vendor code.
        chunkSizeWarningLimit: 550,
        rollupOptions: {
            output: {
                manualChunks: getVendorChunk,
            },
        },
    }
});
