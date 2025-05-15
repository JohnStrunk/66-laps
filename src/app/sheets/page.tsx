'use client'

import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import { CourseTypes, ph_event_download_sheet } from "@/modules/phEvents";
import { Divider, Link } from "@heroui/react";
import { ExternalLink, FileText } from "lucide-react";
import { usePostHog } from "posthog-js/react";

type LapCountingSheet = {
    name: string;
    course: CourseTypes;
    url: string;
}

const externalSheets: LapCountingSheet[] = [
    {
        name: "USA Swimming SC 500",
        course: "SC",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/500-yard-freestyle-split-recording-sheet.pdf",
    },
    {
        name: "USA Swimming SC 1000",
        course: "SC",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1000-yard-freestyle-split-recording-sheet.pdf",
    },
    {
        name: "USA Swimming SC 1650",
        course: "SC",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1650-yard-freestyle-split-recording-sheet.pdf",
    },
    {
        name: "USA Swimming LC 800",
        course: "LC",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/800-free-lcb91036fa6cbc6a0a9b57ff00009030c2.pdf",
    },
    {
        name: "USA Swimming LC 1500",
        course: "LC",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1500-meter-freestyle-lc-split-recording-sheet.pdf",
    },
];

export default function Page() {
    const postHog = usePostHog();

    return (
        <>
            <div className="w-full flex flex-col min-h-screen">
                <Nav />
                <div className="prose mx-auto p-6 grow text-inherit bg-inherit">
                    <h1 className="text-inherit bg-inherit">Lap counting sheets</h1>
                    <h2 className="text-inherit bg-inherit text-lg mb-2">66-Laps custom counting sheets</h2>
                    <p className="text-sm">
                        Want to customize these sheets? Check out the{' '}
                        <Link
                            isExternal
                            showAnchorIcon
                            onPress={() => {
                                ph_event_download_sheet(postHog, "editable", "all", false);
                            }}
                            href="https://docs.google.com/spreadsheets/d/1GHPSscX-hn9-Av33UEZ2iyQLtknGxFwlX46lGB50Xc8/edit?usp=sharing"
                            className="text-sm leading-none">
                            editable version.
                        </Link>
                    </p>
                    <ul className="list-none p-0">
                        <li>
                            <Link
                                onPress={() => {
                                    ph_event_download_sheet(postHog, "SC500", "SC", false);
                                }}
                                href="/sheets/SC500.pdf">
                                <FileText />&nbsp;66-Laps SC 500
                            </Link>
                        </li>
                        <li>
                            <Link
                                onPress={() => {
                                    ph_event_download_sheet(postHog, "SC1000-1650", "SC", false);
                                }}
                                href="/sheets/SC1000-1650.pdf">
                                <FileText />&nbsp;66-Laps SC 1000/1650
                            </Link>
                        </li>
                        <li>
                            <Link
                                onPress={() => {
                                    ph_event_download_sheet(postHog, "LC800-1500", "LC", false);
                                }}
                                href="/sheets/LC800-1500.pdf">
                                <FileText />&nbsp;66-Laps LC 800/1500
                            </Link>
                        </li>
                    </ul>
                    <Divider />
                    <h2 className="text-inherit bg-inherit text-lg mb-2">Other counting sheets</h2>
                    <p className="text-sm">
                        The following counting sheets are provided for convenience and are unaffiliated with 66-Laps. All rights belong to their respective owners.
                    </p>
                    <ul className="list-none p-0 md:grid md:grid-cols-2">
                        {externalSheets.map((sheet) => (
                            <li key={sheet.url}>
                                <Link
                                    isExternal
                                    onPress={() => {
                                        ph_event_download_sheet(postHog, sheet.name, sheet.course, true);
                                    }}
                                    href={sheet.url}>
                                    <ExternalLink />&nbsp;{sheet.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <Footer />
            </div>
        </>
    );
}
