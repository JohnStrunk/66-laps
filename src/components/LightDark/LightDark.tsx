"use client";

import { Button, Tooltip } from "@heroui/react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useEffect, useState } from "react";

enum ThemeMode {
    LIGHT = "light",
    DARK = "dark",
    AUTO = "auto",
}

export default function LightDark() {
    const [mode, setMode] = useState<ThemeMode>(ThemeMode.AUTO);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as ThemeMode;
        setMode(savedTheme || ThemeMode.AUTO);
    }, []);

    useEffect(() => {
        if (mode === ThemeMode.LIGHT) {
            localStorage.setItem("theme", ThemeMode.LIGHT);
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
        } else if (mode === ThemeMode.DARK) {
            localStorage.setItem("theme", ThemeMode.DARK);
            document.documentElement.classList.remove("light");
            document.documentElement.classList.add("dark");
        } else {
            localStorage.removeItem("theme");
            const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            document.documentElement.classList.toggle("dark", isDark);
            document.documentElement.classList.toggle("light", !isDark);
        }
    }, [mode]);

    return (
        <>
            {mode === ThemeMode.AUTO && (
                <Tooltip content="Switch to dark mode">
                    <Button
                        isIconOnly
                        aria-label="Switch to dark mode"
                        onPress={() => { setMode(ThemeMode.DARK) }}
                    >
                        <Moon className="w-full h-full m-2" />
                    </Button>
                </Tooltip>
            )}
            {mode === ThemeMode.DARK && (
                <Tooltip content="Switch to light mode">
                    <Button
                        isIconOnly
                        aria-label="Switch to light mode"
                        onPress={() => { setMode(ThemeMode.LIGHT) }}
                    >
                        <Sun className="w-full h-full m-2" />
                    </Button>
                </Tooltip>
            )}
            {mode === ThemeMode.LIGHT && (
                <Tooltip content="Switch to automatic mode">
                    <Button
                        isIconOnly
                        aria-label="Switch to automatic mode"
                        onPress={() => { setMode(ThemeMode.AUTO) }}
                    >
                        <SunMoon className="w-full h-full m-2" />
                    </Button>
                </Tooltip>
            )}
        </>
    );
}
