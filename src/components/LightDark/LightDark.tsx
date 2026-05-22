"use client";

import { ph_event_set_theme } from "@/modules/phEvents";
import { Button, Tooltip } from "@heroui/react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { usePostHog } from "posthog-js/react";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function LightDark() {
  const mounted = useIsMounted();
    const { theme, setTheme } = useTheme()
    const postHog = usePostHog();



    if (!mounted) return null

    return (
        <>
            <div className="flex flex-row gap-2 items-center justify-center">
                <Tooltip>
                    <Tooltip.Trigger tabIndex={0}>
                        <Button
                            isIconOnly
                            variant={theme === "system" ? "primary" : "outline"}
                            aria-label="Automatic light/dark mode"
                            onPress={() => {
                                setTheme("system");
                                ph_event_set_theme(postHog, "system");
                            }}
                        >
                            <SunMoon className="w-full h-full m-2" />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Automatic</Tooltip.Content>
                </Tooltip>
                <Tooltip>
                    <Tooltip.Trigger tabIndex={0}>
                        <Button
                            isIconOnly
                            variant={theme === "dark" ? "primary" : "outline"}
                            aria-label="Switch to dark mode"
                            onPress={() => {
                                setTheme("dark");
                                ph_event_set_theme(postHog, "dark");
                            }}
                        >
                            <Moon className="w-full h-full m-2" />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Dark</Tooltip.Content>
                </Tooltip>
                <Tooltip>
                    <Tooltip.Trigger tabIndex={0}>
                        <Button
                            isIconOnly
                            variant={theme === "light" ? "primary" : "outline"}
                            aria-label="Switch to light mode"
                            onPress={() => {
                                setTheme("light");
                                ph_event_set_theme(postHog, "light");
                            }}
                        >
                            <Sun className="w-full h-full m-2" />
                        </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content>Light</Tooltip.Content>
                </Tooltip>
            </div>
        </>
    );
}
