'use client'

import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import { ph_event_download_sheet } from "@/modules/phEvents";
import { Separator, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, TableContent } from "@heroui/react";
import { FileText } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { externalSheets } from "./sheets";

export default function Page() {
    const postHog = usePostHog();

    return (
        <>
            <div className="w-full flex flex-col min-h-screen">
                <Nav />
                <div className="prose mx-auto p-6 grow">
                    <h1>Lap counting sheets</h1>
                    <h2 className="text-lg mb-2">66-Laps custom counting sheets</h2>
                    <p className="text-sm">
                        Want to customize these sheets? Check out the{' '}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                ph_event_download_sheet(postHog, "editable", "all", false);
                            }}
                            href="https://docs.google.com/spreadsheets/d/1GHPSscX-hn9-Av33UEZ2iyQLtknGxFwlX46lGB50Xc8/edit?usp=sharing"
                            className="text-sm leading-none text-primary hover:underline">
                            editable version.
                        </a>
                    </p>
                    <ul className="list-none p-0">
                        <li>
                            <a
                                onClick={() => {
                                    ph_event_download_sheet(postHog, "SC500", "SC", false);
                                }}
                                href="/sheets/SC500.pdf"
                                className="inline-flex items-center text-primary hover:underline my-1">
                                <FileText className="mr-1" />66-Laps SC 500
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => {
                                    ph_event_download_sheet(postHog, "SC1000-1650", "SC", false);
                                }}
                                href="/sheets/SC1000-1650.pdf"
                                className="inline-flex items-center text-primary hover:underline my-1">
                                <FileText className="mr-1" />66-Laps SC 1000/1650
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => {
                                    ph_event_download_sheet(postHog, "LC800-1500", "LC", false);
                                }}
                                href="/sheets/LC800-1500.pdf"
                                className="inline-flex items-center text-primary hover:underline my-1">
                                <FileText className="mr-1" />66-Laps LC 800/1500
                            </a>
                        </li>
                    </ul>
                    <Separator />
                    <h2 className="text-lg mb-2">Other counting sheets</h2>
                    <p className="text-sm mb-0">
                        The following counting sheets are provided for convenience and are unaffiliated with 66-Laps. All rights belong to their respective owners.
                    </p>

                    <Table aria-label="Lap counting sheets"
                        className="text-foreground [&_tr:nth-child(even)]:bg-black/5 dark:[&_tr:nth-child(even)]:bg-white/5"
                    >
                        <TableContent aria-label="Lap counting sheets">
                            <TableHeader>
                                <TableColumn className="px-4 py-3" isRowHeader>ORGANIZATION</TableColumn>
                                <TableColumn className="text-center px-4 py-3">SHORT COURSE</TableColumn>
                                <TableColumn className="text-center px-4 py-3">LONG COURSE</TableColumn>
                            </TableHeader>
                            <TableBody
                                items={Object.keys(externalSheets).map((org) => ({
                                    id: org,
                                    org,
                                    sheet: externalSheets[org as keyof typeof externalSheets],
                                }))}
                            >
                                {(item) => {
                                    const sheet = item.sheet;
                                    const hasAll = 'all' in sheet && sheet.all && Object.keys(sheet.all as object).length > 0;
                                    const hasSC = 'SC' in sheet && sheet.SC && Object.keys(sheet.SC as object).length > 0;
                                    const hasLC = 'LC' in sheet && sheet.LC && Object.keys(sheet.LC as object).length > 0;

                                    return (
                                        <TableRow id={item.org}>
                                            <TableCell className="px-4 py-3">{item.org}</TableCell>
                                            <TableCell className="text-center px-4 py-3">
                                                {hasAll ? (
                                                    Object.keys(sheet.all as object).map((distance, idx, arr) => (
                                                        <span key={distance}>
                                                            <a
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => {
                                                                    ph_event_download_sheet(postHog, distance, "all", true);
                                                                }}
                                                                href={(sheet.all as Record<string, string>)[distance]}
                                                                className="text-primary hover:underline">
                                                                {distance}
                                                            </a>
                                                            {idx < arr.length - 1 && ', '}
                                                        </span>
                                                    ))
                                                ) : hasSC ? (
                                                    Object.keys(sheet.SC as object).map((distance, idx, arr) => (
                                                        <span key={distance}>
                                                            <a
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => {
                                                                    ph_event_download_sheet(postHog, distance, "SC", true);
                                                                }}
                                                                href={(sheet.SC as Record<string, string>)[distance]}
                                                                className="text-primary hover:underline">
                                                                {distance}
                                                            </a>
                                                            {idx < arr.length - 1 && ', '}
                                                        </span>
                                                    ))
                                                ) : '—'}
                                            </TableCell>
                                            <TableCell className="text-center px-4 py-3">
                                                {hasAll ? '—' : hasLC ? (
                                                    Object.keys(sheet.LC as object).map((distance, idx, arr) => (
                                                        <span key={distance}>
                                                            <a
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={() => {
                                                                    ph_event_download_sheet(postHog, distance, "LC", true);
                                                                }}
                                                                href={(sheet.LC as Record<string, string>)[distance]}
                                                                className="text-primary hover:underline">
                                                                {distance}
                                                            </a>
                                                            {idx < arr.length - 1 && ', '}
                                                        </span>
                                                    ))
                                                ) : '—'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }}
                            </TableBody>
                        </TableContent>
                    </Table>
                </div>
                <Footer />
            </div>
        </>
    );
}
