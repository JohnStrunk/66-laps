'use client'

import LightDark from "@/components/LightDark/LightDark";
import { Link, Separator } from "@heroui/react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentPath = usePathname();
    const isActive = (path: string) => {
        return currentPath === path;
    }
    const menuItems = [
        { name: "How-to", path: "/counting" },
        { name: "Sheets", path: "/sheets" },
        { name: "Practice", path: "/practice" },
        { name: "Count", path: "/app" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-[#00bc7d] border-b-3 border-b-black dark:bg-[#00bc7d] dark:border-b-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <div className="sm:hidden mr-2">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-black hover:bg-black/10 focus:outline-none"
                            >
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
...
                        <Link href="/" className="flex items-center no-underline text-black font-bold">
                            <Image src="/icon.svg" alt="66 Laps" width={32} height={32} className="mr-2 rounded-sm" />
                            <span className="text-xl">66-Laps</span>
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:gap-6">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`text-black font-bold no-underline hover:opacity-70 ${isActive(item.path) ? 'border-b-3 border-b-black' : ''}`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="ml-4">
                            <LightDark />
                        </div>
                    </div>

                    <div className="sm:hidden flex items-center">
                        <LightDark />
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="sm:hidden bg-[#00bc7d] border-t-1 border-t-black/20 pb-4">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`block px-3 py-2 text-black font-bold no-underline hover:bg-black/10 rounded-md ${isActive(item.path) ? 'bg-black/10' : ''}`}
                                onPress={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                    <Separator className="my-2 opacity-20" />
                </div>
            )}
        </nav>
    );
}
