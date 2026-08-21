import {Container} from "@cloudflare/containers";
import type {StopParams} from "@cloudflare/containers";

const CONTAINER_NAME = "primary";
const RUNTIME_BUDGET_STORAGE_KEY = "urban-events-runtime-budget";
const MILLISECONDS_PER_HOUR = 60 * 60 * 1_000;

const REQUIRED_CONTAINER_SECRETS = [
    "APP_KEY",
    "JWT_SECRET",
    "DATABASE_URL",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_PUBLIC_BUCKET",
    "AWS_PRIVATE_BUCKET",
    "AWS_ENDPOINT",
    "AWS_URL",
] as const;

type ContainerEnvironment = Record<string, string>;

type RuntimeBudget = {
    accruedMs: number;
    month: string;
    startedAtMs?: number;
};

function parseContainerSecrets(serializedSecrets: string): ContainerEnvironment {
    let parsedSecrets: unknown;

    try {
        parsedSecrets = JSON.parse(serializedSecrets);
    } catch {
        throw new Error("APP_SECRETS_JSON must be valid JSON");
    }

    if (typeof parsedSecrets !== "object" || parsedSecrets === null || Array.isArray(parsedSecrets)) {
        throw new Error("APP_SECRETS_JSON must contain a JSON object");
    }

    const containerEnvironment: ContainerEnvironment = {};

    for (const [key, value] of Object.entries(parsedSecrets)) {
        if (typeof value !== "string") {
            throw new Error(`APP_SECRETS_JSON value for ${key} must be a string`);
        }

        containerEnvironment[key] = value;
    }

    const missingSecrets = REQUIRED_CONTAINER_SECRETS.filter((key) => !containerEnvironment[key]);

    if (missingSecrets.length > 0) {
        throw new Error(`APP_SECRETS_JSON is missing required values: ${missingSecrets.join(", ")}`);
    }

    return containerEnvironment;
}

function getUtcMonth(timestampMs: number): string {
    return new Date(timestampMs).toISOString().slice(0, 7);
}

function getStartOfNextUtcMonth(timestampMs: number): number {
    const date = new Date(timestampMs);
    return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1);
}

export class UrbanEventsContainer extends Container<Env> {
    defaultPort = 80;
    // The Cloudflare Container SDK requires an explicit entrypoint to
    // start the container process. Without it, the container has no PID 1
    // and exits immediately.
    entrypoint = [
        "docker-php-serversideup-entrypoint",
        "/bin/sh",
        "-c",
        "/startup.sh > /tmp/urban-events-startup.log 2>&1",
    ];
    // Use the application's real readiness endpoint instead of treating an
    // open TCP socket as a completed startup.
    pingEndpoint = "localhost/healthz";
    sleepAfter = "15m";
    enableInternet = true;

    private getContainerEnvironment(publicOrigin: string): ContainerEnvironment {
        const secrets = parseContainerSecrets(this.env.APP_SECRETS_JSON);
        const stripeEnabled = [
            secrets.STRIPE_PUBLIC_KEY,
            secrets.STRIPE_SECRET_KEY,
            secrets.STRIPE_WEBHOOK_SECRET,
        ].every((value) => typeof value === "string" && value.trim().length > 0);

        const hasRedis = typeof secrets.REDIS_URL === "string" && secrets.REDIS_URL.trim().length > 0;

        return {
            ...secrets,
            APP_NAME: "Urban Events",
            APP_ENV: "production",
            APP_DEBUG: "false",
            APP_URL: `${publicOrigin}/api`,
            APP_FRONTEND_URL: publicOrigin,
            APP_SAAS_MODE_ENABLED: "false",
            APP_CDN_URL: secrets.AWS_URL,
            AWS_DEFAULT_REGION: "auto",
            AWS_USE_PATH_STYLE_ENDPOINT: "true",

            CACHE_DRIVER: "redis",
            CACHE_STORE: "redis",
            QUEUE_CONNECTION: "redis",
            SESSION_DRIVER: "redis",
            SESSION_SECURE_COOKIE: "true",
            REDIS_CLIENT: "predis",
            REDIS_DB: "0",

            CORS_ALLOWED_ORIGINS: [
                publicOrigin,
                "https://urbanevents.pk",
                "https://www.urbanevents.pk",
                "https://app.urbanevents.pk",
            ].join(","),
            FILESYSTEM_PUBLIC_DISK: "s3-public",
            FILESYSTEM_PRIVATE_DISK: "s3-private",
            HOME: "/tmp",
            LOG_CHANNEL: "stderr",
            LOG_DEPRECATIONS_CHANNEL: "null",
            LOG_LEVEL: "info",
            MAIL_MAILER: "log",
            NEEM_ENABLED: "false",
            STRIPE_ENABLED: stripeEnabled ? "true" : "false",
            STRIPE_PLATFORM_MANAGED: stripeEnabled ? "true" : "false",
            VITE_API_URL_CLIENT: `${publicOrigin}/api`,
            VITE_API_URL_SERVER: "http://localhost:80/api",
            VITE_FRONTEND_URL: publicOrigin,
            VITE_STRIPE_PUBLISHABLE_KEY: stripeEnabled ? (secrets.STRIPE_PUBLIC_KEY ?? "") : "",
            WEBHOOK_QUEUE_NAME: "default",
        };
    }

    private get monthlyRuntimeBudgetMs(): number {
        const configuredHours = Number.parseFloat(this.env.CONTAINER_RUNTIME_BUDGET_HOURS);

        if (!Number.isFinite(configuredHours) || configuredHours <= 0 || configuredHours > 400) {
            throw new Error("CONTAINER_RUNTIME_BUDGET_HOURS must be between 0 and 400");
        }

        return configuredHours * MILLISECONDS_PER_HOUR;
    }

    private async getRuntimeBudget(nowMs: number): Promise<RuntimeBudget> {
        const currentMonth = getUtcMonth(nowMs);
        const storedBudget = await this.ctx.storage.get<RuntimeBudget>(RUNTIME_BUDGET_STORAGE_KEY);

        if (storedBudget?.month === currentMonth) {
            return storedBudget;
        }

        const resetBudget: RuntimeBudget = {
            accruedMs: 0,
            month: currentMonth,
            ...(storedBudget?.startedAtMs === undefined ? {} : {startedAtMs: nowMs}),
        };

        await this.ctx.storage.put(RUNTIME_BUDGET_STORAGE_KEY, resetBudget);
        return resetBudget;
    }

    private getElapsedRuntimeMs(budget: RuntimeBudget, nowMs: number): number {
        const activeRuntimeMs = budget.startedAtMs === undefined
            ? 0
            : Math.max(0, nowMs - budget.startedAtMs);

        return budget.accruedMs + activeRuntimeMs;
    }

    private async beginRuntimeWindow(nowMs: number): Promise<RuntimeBudget> {
        const budget = await this.getRuntimeBudget(nowMs);

        if (budget.startedAtMs !== undefined) {
            return budget;
        }

        const runningBudget = {...budget, startedAtMs: nowMs};
        await this.ctx.storage.put(RUNTIME_BUDGET_STORAGE_KEY, runningBudget);
        return runningBudget;
    }

    private async settleRuntimeWindow(nowMs: number): Promise<RuntimeBudget> {
        const budget = await this.getRuntimeBudget(nowMs);

        if (budget.startedAtMs === undefined) {
            return budget;
        }

        const settledBudget: RuntimeBudget = {
            accruedMs: this.getElapsedRuntimeMs(budget, nowMs),
            month: budget.month,
        };

        await this.ctx.storage.put(RUNTIME_BUDGET_STORAGE_KEY, settledBudget);
        return settledBudget;
    }

    override async fetch(request: Request): Promise<Response> {
        const nowMs = Date.now();
        // Container environment is fixed at process start, so always use the
        // canonical hostname rather than whichever hostname received the
        // first cold-start request.
        const publicOrigin = this.env.APP_ORIGIN;
        const budget = await this.getRuntimeBudget(nowMs);
        const elapsedRuntimeMs = this.getElapsedRuntimeMs(budget, nowMs);

        if (elapsedRuntimeMs >= this.monthlyRuntimeBudgetMs) {
            if (budget.startedAtMs !== undefined) {
                await this.stop();
            }

            const retryAfterSeconds = Math.max(
                1,
                Math.ceil((getStartOfNextUtcMonth(nowMs) - nowMs) / 1_000),
            );

            console.error(JSON.stringify({
                message: "container runtime budget exhausted",
                month: budget.month,
                runtimeHours: elapsedRuntimeMs / MILLISECONDS_PER_HOUR,
            }));

            return Response.json(
                {error: "Service temporarily unavailable due to its monthly runtime budget."},
                {status: 503, headers: {"Retry-After": String(retryAfterSeconds)}},
            );
        }

        // Let the SDK own the complete start-and-proxy lifecycle. Calling
        // startAndWaitForPorts() and then the base fetch() creates a race if
        // the instance turns over between those two operations.
        this.envVars = this.getContainerEnvironment(publicOrigin);
        return this.containerFetch(request);
    }

    override async onStart(): Promise<void> {
        const budget = await this.beginRuntimeWindow(Date.now());
        console.log(JSON.stringify({message: "container started", month: budget.month}));
    }

    override async onStop(params: StopParams): Promise<void> {
        const budget = await this.settleRuntimeWindow(Date.now());
        console.log(JSON.stringify({
            message: "container stopped",
            month: budget.month,
            exitCode: params.exitCode,
            reason: params.reason,
            runtimeHours: budget.accruedMs / MILLISECONDS_PER_HOUR,
        }));
    }

    override onError(error: unknown): never {
        console.error(JSON.stringify({
            message: "container error",
            error: error instanceof Error ? error.message : String(error),
        }));
        throw error;
    }
}

async function proxyToApplication(request: Request, workerEnv: Env): Promise<Response> {
    const container = workerEnv.URBAN_EVENTS.getByName(CONTAINER_NAME);
    return container.fetch(request);
}

export default {
    async fetch(request: Request, workerEnv: Env): Promise<Response> {
        try {
            return await proxyToApplication(request, workerEnv);
        } catch (error) {
            console.error(JSON.stringify({
                message: "application proxy failed",
                error: error instanceof Error ? error.message : String(error),
                path: new URL(request.url).pathname,
            }));

            return Response.json(
                {error: "Urban Events is warming up. Please retry shortly."},
                {status: 503, headers: {"Retry-After": "15"}},
            );
        }
    },

    async scheduled(_controller: ScheduledController, workerEnv: Env, ctx: ExecutionContext): Promise<void> {
        const healthRequest = new Request(new URL("/healthz", workerEnv.APP_ORIGIN), {
            headers: {"X-Urban-Events-Wakeup": "hourly-scheduler"},
        });

        ctx.waitUntil((async () => {
            const response = await proxyToApplication(healthRequest, workerEnv);

            if (!response.ok) {
                console.error(JSON.stringify({
                    message: "hourly application wakeup failed",
                    status: response.status,
                }));
            }

            if (response.body !== null) {
                await response.body.cancel();
            }
        })());
    },
} satisfies ExportedHandler<Env>;
