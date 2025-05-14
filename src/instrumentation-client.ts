import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Add optional integrations for additional features
    integrations: [
        Sentry.extraErrorDataIntegration(),
        Sentry.replayIntegration(),
        posthog.sentryIntegration({
            organization: "jstrunk-sentry",
            projectId: 4509018578681856,
            severityAllowList: ["fatal", "error", "warning"],
        }),
    ],

    // Cache Sentry reports if the user is offline
    transport: Sentry.makeBrowserOfflineTransport(Sentry.makeFetchTransport),

    // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
    tracesSampleRate: 1,

    // Define how likely Replay events are sampled.
    // This sets the sample rate to be 10%. You may want this to be 100% while
    // in development and sample at a lower rate in production
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs.
    replaysOnErrorSampleRate: 1.0,

    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
});

// This export will instrument router navigations, and is only relevant if you enable tracing.
// `captureRouterTransitionStart` is available from SDK version 9.12.0 onwards
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
