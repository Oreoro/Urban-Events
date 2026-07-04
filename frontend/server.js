import express from "express";
import {installGlobals} from "@remix-run/node";
import process from "process";
import {createServer as viteServer} from "vite";
import compression from "compression";
import fs from "node:fs/promises";
import sirv from "sirv";
import cookieParser from "cookie-parser";
import path from "node:path";
import {fileURLToPath} from "node:url";
import * as nodePath from "node:path";
import * as nodeUrl from "node:url";
import "dotenv/config";
import {sitemapIndexHandler, sitemapEventsHandler, sitemapOrganizersHandler} from "./src/sitemap/proxy.js";

installGlobals();

async function main() {
    const base = process.env.BASE || "/";
    const port = process.argv.includes("--port")
        ? process.argv[process.argv.indexOf("--port") + 1]
        : process.env.NODE_PORT || 5678;
    const isProduction = process.env.NODE_ENV === "production";

    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    const templateHtml = isProduction
        ? await fs.readFile("./dist/client/index.html", "utf-8")
        : "";

    const ssrManifest = isProduction
        ? await fs.readFile("./dist/client/.vite/ssr-manifest.json", "utf-8")
        : undefined;

    const app = express();
    app.use(cookieParser());

    app.use('/.well-known', express.static(path.join(__dirname, 'public/.well-known')));

    let vite;

    if (!isProduction) {
        vite = await viteServer({
            server: { middlewareMode: true },
            appType: "custom",
            base,
        });

        app.use(vite.middlewares);
    } else {
        app.use(compression());
        app.use(base, sirv(path.join(__dirname, "./dist/client"), { extensions: [] }));
    }

    const firstHeaderValue = (value) => {
        if (Array.isArray(value)) {
            return value[0];
        }

        return value?.split(",")[0]?.trim();
    };

    const localHostnames = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

    const getHostname = (host = "") => {
        const trimmedHost = host.trim();

        if (!trimmedHost) {
            return "";
        }

        if (trimmedHost.startsWith("[")) {
            const closingBracketIndex = trimmedHost.indexOf("]");

            return closingBracketIndex > 0
                ? trimmedHost.slice(1, closingBracketIndex).toLowerCase()
                : trimmedHost.toLowerCase();
        }

        return trimmedHost.split(":")[0].toLowerCase();
    };

    const isLocalHostname = (hostname = "") => (
        localHostnames.has(hostname.replace(/^\[|\]$/g, "").toLowerCase())
    );

    const isLocalHost = (host) => isLocalHostname(getHostname(host));

    const normalizeProtocol = (protocol) => {
        const trimmedProtocol = protocol?.replace(":", "").toLowerCase();

        return ["http", "https"].includes(trimmedProtocol)
            ? trimmedProtocol
            : undefined;
    };

    const getPublicOrigin = (req) => {
        const host = firstHeaderValue(req.get("x-forwarded-host")) || req.get("host");
        const protocol = isLocalHost(host)
            ? normalizeProtocol(firstHeaderValue(req.get("x-forwarded-proto"))) || req.protocol || "http"
            : "https";

        return `${protocol}://${host}`;
    };

    const isPublicBrowserUrl = (value) => {
        if (!value) {
            return false;
        }

        if (value.startsWith("/")) {
            return true;
        }

        try {
            const url = new URL(value);
            return url.protocol === "https:" && !isLocalHostname(url.hostname);
        } catch {
            return false;
        }
    };

    const getViteEnvironmentVariables = (req) => {
        const publicOrigin = getPublicOrigin(req);
        const envVars = {};
        for (const key in process.env) {
            if (key.startsWith('VITE_')) {
                envVars[key] = process.env[key];
            }
        }

        if (!isPublicBrowserUrl(envVars.VITE_FRONTEND_URL)) {
            envVars.VITE_FRONTEND_URL = publicOrigin;
        }

        if (!isPublicBrowserUrl(envVars.VITE_API_URL_CLIENT)) {
            envVars.VITE_API_URL_CLIENT = `${publicOrigin}/api`;
        }

        if (!isPublicBrowserUrl(envVars.VITE_API_URL_SERVER)) {
            envVars.VITE_API_URL_SERVER = `${publicOrigin}/api`;
        }

        return JSON.stringify(envVars);
    };

    app.get('/robots.txt', (req, res) => {
        const frontendUrl = isPublicBrowserUrl(process.env.VITE_FRONTEND_URL)
            ? process.env.VITE_FRONTEND_URL
            : getPublicOrigin(req);
        const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${frontendUrl}/sitemap.xml
`;
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.status(200).send(robotsTxt);
    });

    app.get('/sitemap.xml', sitemapIndexHandler);
    app.get('/sitemap-events-:page.xml', sitemapEventsHandler);
    app.get('/sitemap-organizers-:page.xml', sitemapOrganizersHandler);

    app.use("*", async (req, res) => {
        const url = req.originalUrl.replace(base, "");

        try {
            let template;
            let render;

            if (!isProduction) {
                template = await fs.readFile(path.join(__dirname, "./index.html"), "utf-8");
                template = await vite.transformIndexHtml(url, template);
                render = (await vite.ssrLoadModule("/src/entry.server.tsx")).render;
            } else {
                template = templateHtml;
                render = (await dynamicImport(path.join(__dirname, "./dist/server/entry.server.js"))).render;
            }

            const { appHtml, dehydratedState, helmetContext } = await render(
                { req, res },
                ssrManifest
            );
            const stringifiedState = JSON.stringify(dehydratedState);

            const helmetHtml = Object.values(helmetContext.helmet || {})
                .map((value) => value.toString() || "")
                .join(" ");

            const envVariablesHtml = `<script>window.hievents = ${getViteEnvironmentVariables(req)};</script>`;

            const headSnippets = [];
            if (process.env.VITE_FATHOM_SITE_ID) {
                headSnippets.push(`
                <script src="https://cdn.usefathom.com/script.js" data-spa="auto" data-site="${process.env.VITE_FATHOM_SITE_ID}" defer></script>
            `);
            }

            const html = template
                .replace("<!--head-snippets-->", headSnippets.join("\n"))
                .replace("<!--app-html-->", appHtml)
                .replace("<!--dehydrated-state-->", `<script>window.__REHYDRATED_STATE__ = ${stringifiedState}</script>`)
                .replace("<!--environment-variables-->", envVariablesHtml)
                .replace(/<!--render-helmet-->.*?<!--\/render-helmet-->/s, helmetHtml);

            res.setHeader("Content-Type", "text/html");
            return res.status(200).end(html);
        } catch (error) {
            if (error instanceof Response) {
                if (error.status >= 300 && error.status < 400) {
                    return res.redirect(error.status, error.headers.get("Location") || "/");
                } else {
                    return res.status(error.status).send(await error.text());
                }
            }

            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });

    app.listen(port, () => {
        console.info(`SSR Serving at http://localhost:${port}`);
    });

    const dynamicImport = async (path) => {
        return import(
            nodePath.isAbsolute(path) ? nodeUrl.pathToFileURL(path).toString() : path
        );
        
    }
}
main();
