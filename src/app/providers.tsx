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



function setupTestMocks() {
    if (typeof window === 'undefined') return;

    // WebGL Mock
    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    (HTMLCanvasElement.prototype as unknown as { getContext: unknown }).getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
            const mock = {
                canvas: this,
                getShaderPrecisionFormat: () => ({ precision: 1, rangeMin: 1, rangeMax: 1 }),
                getExtension: () => null,
                getContextAttributes: () => ({}),
                getParameter: (param: number) => {
                    if (param === 35661) return 16; // MAX_TEXTURE_IMAGE_UNITS
                    if (param === 0x1f00) return 'WebGL Mock'; // UNMASKED_VENDOR_WEBGL
                    if (param === 0x1f01) return 'Mock Renderer'; // UNMASKED_RENDERER_WEBGL
                    if (param === 0x8df8) return 1024; // MAX_VERTEX_UNIFORM_VECTORS
                    if (param === 0x84E2) return 16; // MAX_TEXTURE_IMAGE_UNITS
                    return 0;
                },
                createProgram: () => ({}),
                createShader: () => ({}),
                shaderSource: () => { },
                compileShader: () => { },
                getShaderParameter: () => true,
                getProgramParameter: () => true,
                linkProgram: () => { },
                useProgram: () => { },
                createBuffer: () => ({}),
                bindBuffer: () => { },
                bufferData: () => { },
                getAttribLocation: () => 0,
                enableVertexAttribArray: () => { },
                vertexAttribPointer: () => { },
                drawArrays: () => { },
                viewport: () => { },
                clear: () => { },
                clearColor: () => { },
                createTexture: () => ({}),
                bindTexture: () => { },
                texImage2D: () => { },
                texParameteri: () => { },
                activeTexture: () => { },
                getError: () => 0,
                flush: () => { },
                finish: () => { },
                getSupportedExtensions: () => [],
                scissor: () => { },
                stencilFunc: () => { },
                stencilMask: () => { },
                stencilOp: () => { },
                colorMask: () => { },
                pixelStorei: () => { },
                readPixels: () => { },
                // WebGL Constants
                VERTEX_SHADER: 35633,
                FRAGMENT_SHADER: 35632,
                HIGH_FLOAT: 36338,
                MEDIUM_FLOAT: 36337,
                LOW_FLOAT: 36336,
                MAX_TEXTURE_IMAGE_UNITS: 35661,
                MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660,
                MAX_TEXTURE_SIZE: 3379,
                MAX_CUBE_MAP_TEXTURE_SIZE: 34076,
                MAX_VERTEX_ATTRIBS: 34921,
                MAX_VERTEX_UNIFORM_VECTORS: 36347,
                MAX_VARYING_VECTORS: 36348,
                MAX_FRAGMENT_UNIFORM_VECTORS: 36349,
                MAX_SAMPLES: 36183,
                SAMPLES: 32937,
                MAX_COMBINED_TEXTURE_IMAGE_UNITS: 35661,
                VERSION: 7938,
            };
            return mock;
        }
        return (originalGetContext as (...args: unknown[]) => unknown).apply(this, [type, ...args]);
    };

    // Vibrate Mock
    const win = window as unknown as { __VIBRATE_CALLS__: unknown[] };
    if (!win.__VIBRATE_CALLS__) {
        win.__VIBRATE_CALLS__ = [];
    }
    try {
        Object.defineProperty(window.navigator, 'vibrate', {
            value: (pattern: number | number[]) => {
                win.__VIBRATE_CALLS__.push(pattern);
                return true;
            },
            configurable: true,
            writable: true
        });
    } catch (e) {
        console.error('Failed to mock navigator.vibrate:', e);
    }
}

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        // Mocks for headless environments
        if (typeof window !== 'undefined' && window.location.search.includes('testMode=true')) {
            setupTestMocks();
        }
    }, []);

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
