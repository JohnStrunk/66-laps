'use client'

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';


// Client-side routing for HeroUI + Next.js
// https://heroui.com/docs/guide/routing#app-router
declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
    }
}

import { usePostHog } from 'posthog-js/react';
import { Suspense, useEffect } from "react";

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useBellLapStore } from '@/modules/bellLapStore';

function GlobalTimer() {
    const view = useBellLapStore(state => state.view);
    const tick = useBellLapStore(state => state.tick);

    useEffect(() => {
        if (view !== 'race') return;

        const interval = setInterval(() => {
            tick();
        }, 100);

        return () => clearInterval(interval);
    }, [view, tick]);

    return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
            posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
                api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
                person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
                capture_pageview: false, // Disable automatic pageview capture, as we capture manually
                capture_pageleave: true, // Capture pageleave events
            })
        }
    }, [])

    return (
        <PHProvider client={posthog}>
            <SuspendedPostHogPageView />
            {children}
        </PHProvider>
    )
}

function PostHogPageView() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const posthog = usePostHog()

    // Track pageviews
    useEffect(() => {
        if (pathname && posthog) {
            let url = window.origin + pathname
            if (searchParams.toString()) {
                url = url + "?" + searchParams.toString();
            }

            posthog.capture('$pageview', { '$current_url': url })
        }
    }, [pathname, searchParams, posthog])

    return null
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView() {
    return (
        <Suspense fallback={null}>
            <PostHogPageView />
        </Suspense>
    )
}



export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <PostHogProvider>
            <GlobalTimer />
            <HeroUIProvider navigate={router.push}>
                <ThemeProvider attribute="class" scriptProps={{ 'data-cfasync': 'false' }}>
                    {children}
                </ThemeProvider>
            </HeroUIProvider>
        </PostHogProvider>
    )
}
