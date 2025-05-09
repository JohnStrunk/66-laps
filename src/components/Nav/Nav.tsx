'use client'

import LightDark from "@/components/LightDark/LightDark";
import { Divider, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
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
        { name: "Practice", path: "/app" },
    ];

    const menuIcon = (isOpen: boolean = false) => {
        const className = "w-[1.5em] h-[1.5em]";
        return isOpen ? (<X className={className} />) : (<Menu className={className} />);
    }

    return (
        <>
            <Navbar onMenuOpenChange={setIsMenuOpen} isBordered shouldHideOnScroll>
                <NavbarContent>
                    <NavbarMenuToggle className="sm:hidden" aria-label={isMenuOpen ? "Close menu" : "Open menu"} icon={menuIcon} />
                    <Link href="/" >
                        <NavbarBrand>
                            <Image src="/icon.svg" alt="66 Laps" className="w-[2em] h-[2em] mr-2 rounded-sm" />
                            <p className="text-xl font-bold">66-Laps</p>
                        </NavbarBrand>
                    </Link>
                </NavbarContent>

                <NavbarContent className="hidden sm:flex gap-4" justify="start">
                    {menuItems.map((item, index) => (
                        <NavbarItem key={`${item}-${index}`} isActive={isActive(item.path)}>
                            <Link href={item.path}>
                                {item.name}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent className="hidden sm:flex" justify="end">
                    <NavbarItem>
                        <LightDark />
                    </NavbarItem>
                </NavbarContent>

                <NavbarMenu>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link className="w-full font-bold" href={item.path}>
                                {item.name}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                    <Divider className="my-2" />
                    <NavbarMenuItem className="flex flex-row items-center gap-4">
                        <p className="font-bold">Theme:</p>
                        <LightDark />
                    </NavbarMenuItem>
                </NavbarMenu>
            </Navbar>
        </>
    );
}
