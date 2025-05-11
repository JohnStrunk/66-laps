'use client'

import { HeroUIProvider } from '@heroui/react';
import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';


// Client-side routing for HeroUI + Next.js
// https://heroui.com/docs/guide/routing#app-router
declare module "@react-types/shared" {
    interface RouterConfig {
        routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
    }
}

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    return (
        <HeroUIProvider navigate={router.push}>
            <ThemeProvider attribute="class" scriptProps={{ 'data-cfasync': 'false' }}>
                {children}
            </ThemeProvider>
        </HeroUIProvider>
    )
}
