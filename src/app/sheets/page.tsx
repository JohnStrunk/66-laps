'use client'

import Nav from "@/components/Nav/Nav";
import { Divider, Link } from "@heroui/react";
import { ExternalLink, FileText } from "lucide-react";

type LapCountingSheet = {
    name: string;
    url: string;
}

const externalSheets: LapCountingSheet[] = [
    {
        name: "USA Swimming SC 500",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/500-yard-freestyle-split-recording-sheet.pdf",
    },
    {
        name: "USA Swimming SC 1000",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1000-yard-freestyle-split-recording-sheet.pdf",
    },
    {
        name: "USA Swimming SC 1650",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1650-yard-freestyle-split-recording-sheet.pdf",
    },
    {
        name: "USA Swimming LC 800",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/800-free-lcb91036fa6cbc6a0a9b57ff00009030c2.pdf",
    },
    {
        name: "USA Swimming LC 1500",
        url: "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1500-meter-freestyle-lc-split-recording-sheet.pdf",
    },
];

export default function Page() {
    return (
        <>
            <Nav />
            <div className="prose mx-auto p-6">
                <h1>Lap counting sheets</h1>
                <h2 className="text-lg mb-2">66-Laps custom counting sheets</h2>
                <p className="text-sm">
                    Want to customize these sheets? Check out the{' '}
                    <Link
                        isExternal
                        showAnchorIcon
                        href="https://docs.google.com/spreadsheets/d/1GHPSscX-hn9-Av33UEZ2iyQLtknGxFwlX46lGB50Xc8/edit?usp=sharing"
                        className="text-sm leading-none">
                        editable version.
                    </Link>
                </p>
                <ul className="list-none p-0">
                    <li>
                        <Link href="/sheets/SC500.pdf">
                            <FileText />&nbsp;66-Laps SC 500
                        </Link>
                    </li>
                    <li>
                        <Link href="/sheets/SC1000-1650.pdf">
                            <FileText />&nbsp;66-Laps SC 1000/1650
                        </Link>
                    </li>
                    <li>
                        <Link href="/sheets/LC800-1500.pdf">
                            <FileText />&nbsp;66-Laps LC 800/1500
                        </Link>
                    </li>
                </ul>
                <Divider />
                <h2 className="text-lg mb-2">Other counting sheets</h2>
                <p className="text-sm">
                    The following counting sheets are provided for convenience and are unaffiliated with 66-Laps. All rights belong to their respective owners.
                </p>
                <ul className="list-none p-0 md:grid md:grid-cols-2">
                    {externalSheets.map((sheet) => (
                        <li key={sheet.url}>
                            <Link isExternal href={sheet.url}>
                                <ExternalLink />&nbsp;{sheet.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}
