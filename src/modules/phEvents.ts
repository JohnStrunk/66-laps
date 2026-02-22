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

/**
 * Event to be triggered when a new race is started in the Bell Lap PWA.
 *
 * @param postHog - The PostHog client instance
 * @param event - The event type (e.g., "500 SC")
 * @param laneCount - The number of lanes
 * @param eventNumber - Optional event number
 * @param heatNumber - Optional heat number
 */
export function ph_event_bell_lap_race_start(
    postHog: PostHog | undefined,
    event: string,
    laneCount: number,
    eventNumber: string,
    heatNumber: string
) {
    return postHog?.capture("bell_lap_race_start", {
        event,
        laneCount,
        eventNumber,
        heatNumber
    });
}

/**
 * Event to be triggered when a lane is touched (automatic increment).
 *
 * @param postHog - The PostHog client instance
 * @param laneNumber - The lane number
 * @param currentCount - The count before the touch
 * @param event - The event type
 */
export function ph_event_bell_lap_lane_touch(
    postHog: PostHog | undefined,
    laneNumber: number,
    currentCount: number,
    event: string
) {
    return postHog?.capture("bell_lap_lane_touch", {
        laneNumber,
        currentCount,
        event
    });
}

/**
 * Event to be triggered when a lane count is manually overridden.
 *
 * @param postHog - The PostHog client instance
 * @param laneNumber - The lane number
 * @param delta - The change in count (+2 or -2)
 * @param currentCount - The count before the override
 */
export function ph_event_bell_lap_lane_override(
    postHog: PostHog | undefined,
    laneNumber: number,
    delta: number,
    currentCount: number
) {
    return postHog?.capture("bell_lap_lane_override", {
        laneNumber,
        delta,
        currentCount
    });
}

/**
 * Event to be triggered when a lane's empty state is toggled.
 *
 * @param postHog - The PostHog client instance
 * @param laneNumber - The lane number
 * @param isEmpty - The new empty state
 */
export function ph_event_bell_lap_lane_toggle_empty(
    postHog: PostHog | undefined,
    laneNumber: number,
    isEmpty: boolean
) {
    return postHog?.capture("bell_lap_lane_toggle_empty", {
        laneNumber,
        isEmpty
    });
}
