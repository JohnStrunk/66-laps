'use client'

import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import { Card, Separator, Link } from "@heroui/react";
import { ClipboardList, FolderOpen, MonitorPlay, MonitorSmartphone } from "lucide-react";
import Image from "next/image";

export default function Home() {
    return (
        <>
            <div className="w-full flex flex-col min-h-screen">

                <Nav />
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 justify-items-center content-center grow gap-8 mx-8 py-12">
                    <Link href="/counting" className="no-underline text-foreground hover:opacity-100">
                        <Card
                            className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-accent-soft cursor-pointer"
                        >
                            <Card.Header className="flex flex-row items-center p-4">
                                <ClipboardList className="w-[2em] h-[2em]" />
                                <p className="ml-2 text-xl font-bold">How to count</p>
                            </Card.Header>
                            <Separator />
                            <Card.Content className="items-center justify-center overflow-hidden flex flex-col grow p-4">
                                <Image
                                    src="/images/500-L16.png"
                                    alt="Example lap counting sheet"
                                    width={240}
                                    height={240}
                                    className="max-h-[240px] object-contain" />
                                <p className="mt-2 text-center">Learn how to count laps</p>
                            </Card.Content>
                        </Card>
                    </Link>

                    <Link href="/sheets" className="no-underline text-foreground hover:opacity-100">
                        <Card
                            className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-accent-soft cursor-pointer"
                        >
                            <Card.Header className="flex flex-row items-center p-4">
                                <FolderOpen className="w-[2em] h-[2em]" />
                                <p className="ml-2 text-xl font-bold">Counter sheets</p>
                            </Card.Header>
                            <Separator />
                            <Card.Content className="items-center justify-center overflow-hidden flex flex-col grow p-4">
                                <Image
                                    src="/images/sheet-stack.png"
                                    alt="Stack of lap counting sheets"
                                    width={240}
                                    height={240}
                                    className="max-h-[240px] object-contain" />
                                <p className="mt-2 text-center">Download lap counting sheets</p>
                            </Card.Content>
                        </Card>
                    </Link>

                    <Link href="/practice" className="no-underline text-foreground hover:opacity-100">
                        <Card
                            className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-accent-soft cursor-pointer"
                        >
                            <Card.Header className="flex flex-row items-center p-4">
                                <MonitorPlay className="w-[2em] h-[2em]" />
                                <p className="ml-2 text-xl font-bold">Practice counting</p>
                            </Card.Header>
                            <Separator />
                            <Card.Content className="items-center justify-center overflow-hidden flex flex-col grow p-4">
                                <Image
                                    src="/images/practice.png"
                                    alt="Pool preview"
                                    width={240}
                                    height={240}
                                    className="max-h-[240px] object-contain" />
                                <p className="mt-2 text-center">Practice counting for distance events</p>
                            </Card.Content>
                        </Card>
                    </Link>

                    <Link href="/app" className="no-underline text-foreground hover:opacity-100">
                        <Card
                            className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-accent-soft cursor-pointer"
                        >
                            <Card.Header className="flex flex-row items-center p-4">
                                <MonitorSmartphone className="w-[2em] h-[2em]" />
                                <p className="ml-2 text-xl font-bold">Counting app</p>
                            </Card.Header>
                            <Separator />
                            <Card.Content className="items-center justify-center overflow-hidden flex flex-col grow p-4">
                                <Image
                                    src="/images/app.png"
                                    alt="App preview"
                                    width={240}
                                    height={240}
                                    className="max-h-[240px] object-contain" />
                                <p className="mt-2 text-center">Use the app to count laps</p>
                            </Card.Content>
                        </Card>
                    </Link>
                </div>
                <Footer />
            </div>
        </>
    );
}
