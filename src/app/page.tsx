'use client'

import Nav from "@/components/Nav/Nav";
import { Card, CardBody, CardHeader, Divider, Image } from "@heroui/react";
import { ClipboardList, FolderOpen, MonitorPlay } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const navTo = (target: string) => {
        router.push(target);
    };

    return (
        <>
            <Nav />
            <div className="flex flex-col lg:flex-row justify-center items-center h-full gap-4 mr-4 ml-4 mt-[10%]">
                <Card
                    className="max-w-xs h-96 mx-auto mt-6"
                    isPressable
                    onPress={() => navTo("/counting")}
                >
                    <CardHeader className="flex flex-row items-center">
                        <ClipboardList className="w-[2em] h-[2em]" />
                        <p className="ml-2 text-xl font-bold">How to count</p>
                    </CardHeader>
                    <Divider />
                    <CardBody className="items-center justify-center">
                        <Image
                            removeWrapper
                            src="/images/500-L16.png"
                            alt="Example lap counting sheet"
                            className="w-full h-full object-contain" />
                        <p>Learn how to count laps</p>
                    </CardBody>
                </Card>

                <Card
                    className="max-w-xs h-96 mx-auto mt-6"
                    isPressable
                    onPress={() => navTo("/sheets")}
                >
                    <CardHeader className="flex flex-row items-center">
                        <FolderOpen className="w-[2em] h-[2em]" />
                        <p className="ml-2 text-xl font-bold">Counter sheets</p>
                    </CardHeader>
                    <Divider />
                    <CardBody className="items-center justify-center">
                        <Image
                            removeWrapper
                            src="/images/sheet-stack.png"
                            alt="Stack of lap counting sheets"
                            className="w-full h-full object-contain" />
                        <p>Download lap counting sheets</p>
                    </CardBody>
                </Card>

                <Card
                    className="max-w-xs h-96 mx-auto mt-6"
                    isPressable
                    onPress={() => navTo("/app")}
                >
                    <CardHeader className="flex flex-row items-center">
                        <MonitorPlay className="w-[2em] h-[2em]" />
                        <p className="ml-2 text-xl font-bold">Practice counting</p>
                    </CardHeader>
                    <Divider />
                    <CardBody className="items-center justify-center">
                        <Image
                            removeWrapper
                            src="/images/app.png"
                            alt="Pool preview"
                            className="w-full h-full object-contain" />
                        <p>Practice counting for distance events</p>
                    </CardBody>
                </Card>
            </div>
        </>
    );
}
