/**
 * This file defines the custom events for PostHog.
 */

import { SettingsValue } from "@/components/Settings/Settings";
import { PostHog } from "posthog-js";

export type CourseTypes = "SC" | "LC" | "all";

/**
 * Event to be triggered when a user downloads a counter sheet.
 *
 * @param postHog - The PostHog analytics instance
 * @param sheetName - The name of the sheet being downloaded
 * @param course - The course type (SC, LC, or all)
 * @param isExternal - Whether the sheet is from an external source
 * @returns The result of the PostHog `capture` method
 */
export function ph_event_download_sheet(
    postHog: PostHog | undefined,
    sheetName: string,
    course: CourseTypes,
    isExternal: boolean
) {
    return postHog?.capture("download_sheet", {
        name: sheetName,
        course: course,
        isExternal: isExternal,
    });
}

/**
 * Event to be triggered when a user clicks on an outbound link.
 *
 * @param postHog - The PostHog analytics instance
 * @param name - The name associated with the outbound link event.
 * @param url - The URL of the outbound link.
 * @returns The result of the PostHog `capture` method, or undefined if `postHog` is not provided.
 */
export function ph_event_link_out(
    postHog: PostHog | undefined,
    name: string,
    url: string,
) {
    return postHog?.capture("link_out", {
        name: name,
        url: url,
    });
}

/**
 * Event to be triggered when a swimulation ends.
 *
 * @param postHog - The PostHog client instance used to capture the event.
 * @param settings - The settings object that contains the swimulation settings.
 * @param isCompleted - Indicates whether the swimulation was completed or aborted early.
 * @param elapsedTimeSec - The elapsed time of the swimulation in seconds.
 * @returns The result of the PostHog `capture` method, or undefined if `postHog` is not provided.
 */
export function ph_event_swimulation(
    postHog: PostHog | undefined,
    settings: SettingsValue,
    isCompleted: boolean,
    elapsedTimeSec: number,
) {
    postHog?.capture("swimulation_end", {
        ...settings,
        isCompleted: isCompleted,
        elapsedTimeSec: elapsedTimeSec,
    });
}

/**
 * Event to be triggered when a user sets the theme.
 *
 * @param postHog - The PostHog client instance used to capture the event.
 * @param themeName - The theme that was set by the user.
 * @returns The result of the PostHog `capture` method, or undefined if `postHog` is not provided.
 */
export function ph_event_set_theme(
    postHog: PostHog | undefined,
    themeName: string,
) {
    return postHog?.capture("set_theme", {
        theme: themeName,
    });
}
