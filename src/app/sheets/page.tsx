'use client'

import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import { ph_event_download_sheet } from "@/modules/phEvents";
import { Divider, Link, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { FileText } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { externalSheets } from "./sheets";

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
                    <p className="text-sm mb-0">
                        The following counting sheets are provided for convenience and are unaffiliated with 66-Laps. All rights belong to their respective owners.
                    </p>

                    <Table aria-label="Lap counting sheets" isStriped removeWrapper
                        classNames={{
                            th: "dark:text-foreground",
                        }}>
                        <TableHeader>
                            <TableColumn>ORGANIZATION</TableColumn>
                            <TableColumn align="center">SHORT COURSE</TableColumn>
                            <TableColumn align="center">LONG COURSE</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={Object.keys(externalSheets).map((org) => ({
                                org,
                                sheet: externalSheets[org as keyof typeof externalSheets],
                            }))}
                        >
                            {(item) => {
                                const sheet = item.sheet;
                                const hasAll = 'all' in sheet && sheet.all && Object.keys(sheet.all as object).length > 0;
                                const hasSC = 'SC' in sheet && sheet.SC && Object.keys(sheet.SC as object).length > 0;
                                const hasLC = 'LC' in sheet && sheet.LC && Object.keys(sheet.LC as object).length > 0;
                                if (hasAll) {
                                    return (
                                        <TableRow key={item.org}>
                                            <TableCell>{item.org}</TableCell>
                                            <TableCell colSpan={2}>
                                                {Object.keys(sheet.all as object).map((distance, idx, arr) => (
                                                    <span key={distance}>
                                                        <Link
                                                            isExternal
                                                            onPress={() => {
                                                                ph_event_download_sheet(postHog, distance, "all", true);
                                                            }}
                                                            href={(sheet.all as Record<string, string>)[distance]}>
                                                            {distance}
                                                        </Link>
                                                        {idx < arr.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    );
                                } else {
                                    return (
                                        <TableRow key={item.org}>
                                            <TableCell>{item.org}</TableCell>
                                            <TableCell>
                                                {hasSC ? (Object.keys(sheet.SC as object).map((distance, idx, arr) => (
                                                    <span key={distance}>
                                                        <Link
                                                            isExternal
                                                            onPress={() => {
                                                                ph_event_download_sheet(postHog, distance, "SC", true);
                                                            }}
                                                            href={(sheet.SC as Record<string, string>)[distance]}>
                                                            {distance}
                                                        </Link>
                                                        {idx < arr.length - 1 && ', '}
                                                    </span>
                                                ))
                                                ) : null}
                                            </TableCell>
                                            <TableCell>
                                                {hasLC ? (Object.keys(sheet.LC as object).map((distance, idx, arr) => (
                                                    <span key={distance}>
                                                        <Link
                                                            isExternal
                                                            onPress={() => {
                                                                ph_event_download_sheet(postHog, distance, "LC", true);
                                                            }}
                                                            href={(sheet.LC as Record<string, string>)[distance]}>
                                                            {distance}
                                                        </Link>
                                                        {idx < arr.length - 1 && ', '}
                                                    </span>
                                                ))
                                                ) : null}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            }}
                        </TableBody>
                    </Table>
                </div>
                <Footer />
            </div>
        </>
    );
}
