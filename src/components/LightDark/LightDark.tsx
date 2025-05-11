"use client";

import { Button, Tooltip } from "@heroui/react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function LightDark() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <>
            <div className="flex flex-row gap-2 items-center justify-center">
                <Tooltip content="Automatic">
                    <Button
                        isIconOnly
                        variant={theme === "system" ? "solid" : "faded"}
                        aria-label="Automatic light/dark mode"
                        onPress={() => { setTheme("system") }}
                    >
                        <SunMoon className="w-full h-full m-2" />
                    </Button>
                </Tooltip>
                <Tooltip content="Dark">
                    <Button
                        isIconOnly
                        variant={theme === "dark" ? "solid" : "faded"}
                        aria-label="Switch to dark mode"
                        onPress={() => { setTheme("dark") }}
                    >
                        <Moon className="w-full h-full m-2" />
                    </Button>
                </Tooltip>
                <Tooltip content="Light">
                    <Button
                        isIconOnly
                        variant={theme === "light" ? "solid" : "faded"}
                        aria-label="Switch to light mode"
                        onPress={() => { setTheme("light") }}
                    >
                        <Sun className="w-full h-full m-2" />
                    </Button>
                </Tooltip>
            </div>
        </>
    );
}
