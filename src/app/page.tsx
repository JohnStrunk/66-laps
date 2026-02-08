'use client'

import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import { Card, CardBody, CardHeader, Divider, Image } from "@heroui/react";
import { ClipboardList, FolderOpen, MonitorPlay, MonitorSmartphone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const navTo = (target: string) => {
        router.push(target);
    };

    return (
        <>
            <div className="w-full flex flex-col min-h-screen">

                <Nav />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-items-center grow gap-8 mx-8 py-12">
                    <Card
                        className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-content4"
                        isPressable
                        shadow="none"
                        onPress={() => navTo("/counting")}
                    >
                        <CardHeader className="flex flex-row items-center">
                            <ClipboardList className="w-[2em] h-[2em]" />
                            <p className="ml-2 text-xl font-bold">How to count</p>
                        </CardHeader>
                        <Divider />
                        <CardBody className="items-center justify-center overflow-hidden">
                            <Image
                                removeWrapper
                                src="/images/500-L16.png"
                                alt="Example lap counting sheet"
                                className="max-h-[240px] object-contain" />
                            <p className="mt-2 text-center">Learn how to count laps</p>
                        </CardBody>
                    </Card>

                    <Card
                        className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-content4"
                        isPressable
                        shadow="none"
                        onPress={() => navTo("/sheets")}
                    >
                        <CardHeader className="flex flex-row items-center">
                            <FolderOpen className="w-[2em] h-[2em]" />
                            <p className="ml-2 text-xl font-bold">Counter sheets</p>
                        </CardHeader>
                        <Divider />
                        <CardBody className="items-center justify-center overflow-hidden">
                            <Image
                                removeWrapper
                                src="/images/sheet-stack.png"
                                alt="Stack of lap counting sheets"
                                className="max-h-[240px] object-contain" />
                            <p className="mt-2 text-center">Download lap counting sheets</p>
                        </CardBody>
                    </Card>

                    <Card
                        className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-content4"
                        isPressable
                        shadow="none"
                        onPress={() => navTo("/practice")}
                    >
                        <CardHeader className="flex flex-row items-center">
                            <MonitorPlay className="w-[2em] h-[2em]" />
                            <p className="ml-2 text-xl font-bold">Practice counting</p>
                        </CardHeader>
                        <Divider />
                        <CardBody className="items-center justify-center overflow-hidden">
                            <Image
                                removeWrapper
                                src="/images/practice.png"
                                alt="Pool preview"
                                className="max-h-[240px] object-contain" />
                            <p className="mt-2 text-center">Practice counting for distance events</p>
                        </CardBody>
                    </Card>

                    <Card
                        className="w-80 h-96 drop-shadow-2xl hover:drop-shadow-content4"
                        isPressable
                        shadow="none"
                        onPress={() => navTo("/app")}
                    >
                        <CardHeader className="flex flex-row items-center">
                            <MonitorSmartphone className="w-[2em] h-[2em]" />
                            <p className="ml-2 text-xl font-bold">Counting app</p>
                        </CardHeader>
                        <Divider />
                        <CardBody className="items-center justify-center overflow-hidden">
                            <Image
                                removeWrapper
                                src="/images/app.png"
                                alt="App preview"
                                className="max-h-[240px] object-contain" />
                            <p className="mt-2 text-center">Use the app to count laps</p>
                        </CardBody>
                    </Card>
                </div>
                <Footer />
            </div>
        </>
    );
}
