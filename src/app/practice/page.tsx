'use client'

import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import Pool, { PoolLength } from "@/components/Pool/Pool";
import Pool3D from "@/components/Pool3D/Pool3D";
import Settings, { NumberingDirection, SettingsValue, SimulationMode, StartingEnd } from "@/components/Settings/Settings";
import { ph_event_swimulation } from "@/modules/phEvents";
import { AVATARS, ISwimmer, SwimmerModel } from "@/modules/SwimmerModel";
import { Button, ButtonGroup } from "@heroui/react";
import { usePostHog } from "posthog-js/react";

import { useCallback, useEffect, useRef, useState } from "react";

enum Mode {
    SETTINGS = "SETTINGS",
    SWIM = "SWIM",
}

type ViewMode = "2D" | "3D";

function makeSwimmer({ poolLength, difficulty, laps, spread }: SettingsValue): ISwimmer {
    const secondsPerLap = poolLength === PoolLength.SC ? 16 : 34; // Average lap time in seconds
    const maxDeviationPerLap = 1.0; // Maximum deviation from the average lap time in seconds
    const maxSlope = 0.15; // Maximum slope of the lap times in percentage over the entire race

    const lapTimes: number[] = Array(laps).fill(0);
    const slope = (Math.random() - 0.5) * maxSlope;
    // Calculate the total deviation per lap
    for (let i = 0; i < laps; i++) {
        // Calculate a random deviation for each lap within the range of
        // -maxDeviationPerLap to maxDeviationPerLap
        const deviation = ((Math.random() - 0.5) * 2 * maxDeviationPerLap);
        // Deviated lap time is the per lap deviation plus the deviation due to the slope
        lapTimes[i] = deviation + slope / laps * i;
    }

    // Add a constant to each lap to obtain the desired total race time. The
    // total time for the race is the nominal time (secondsPerLap * laps)
    // multiplied by the spread factor divided by the difficulty multiplier.
    // The spread factor is the maximum percentage difference from the nominal
    // race time.
    const totalRaceTime = secondsPerLap * laps * (1 + (spread * 2 * (Math.random() - 0.5))) / difficulty;
    const perLapDelta = (totalRaceTime - lapTimes.reduce((a, b) => a + b, 0)) / laps;
    for (let i = 0; i < laps; i++) {
        lapTimes[i] += perLapDelta;
    }
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    return new SwimmerModel(lapTimes, Date.now(), avatar);
}

export default function Page() {
    const [mode, setMode] = useState<Mode>(Mode.SETTINGS);
    const [orderOfFinish, setOrderOfFinish] = useState<number[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("3D");
    const [swimmers, setSwimmers] = useState<ISwimmer[]>([]);
    const [settings, setSettings] = useState<SettingsValue>({
        // dummy values
        poolLength: PoolLength.SC,
        lanes: 8,
        laps: 20,
        difficulty: 1.0,
        spread: 0.05,
        numberingDirection: NumberingDirection.AWAY,
        startingEnd: StartingEnd.LEFT,
        simulationMode: SimulationMode.THREE_D,
    });
    const wakeLock = useRef<WakeLockSentinel | null>(null);
    const startTime = useRef<number>(0);
    const postHog = usePostHog();

    // Send tracking events when the simulation starts and stops.
    useEffect(() => {
        // When we start the swimulation, register a cleanup function
        // to send the event when the simulation ends.
        // This is important because the simulation may end when the user
        // closes the tab or navigates away from the page.
        if (mode === Mode.SWIM) {
            return () => {
                const raceCompleted = swimmers.every((swimmer) => swimmer.isDone());
                const elapsedTimeSec = (Date.now() - startTime.current) / 1000;
                ph_event_swimulation(
                    postHog,
                    settings,
                    raceCompleted,
                    elapsedTimeSec
                );
            }
        }
    }, [mode, postHog, settings, swimmers]);

    // For small screens, request fullscreen when we start the simulation.
    useEffect(() => {
        if (mode === Mode.SWIM && (window.innerWidth <= 768 || window.innerHeight <= 768)) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            }
        }
        if (mode !== Mode.SWIM) {
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }, [mode]);

    // Ensure the screen stays awake when the simulation is running.
    // This is important for mobile devices, where the screen may turn off
    // automatically after a period of inactivity.
    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator && mode === Mode.SWIM) {
                    wakeLock.current = await navigator.wakeLock.request('screen');
                }
            } catch (err) {
                console.error('Failed to acquire wake lock:', err);
            }
        };

        requestWakeLock();

        return () => {
            if (wakeLock.current) {
                wakeLock.current.release().catch((err) => {
                    console.error('Failed to release wake lock:', err);
                });
                wakeLock.current = null;
            }
        };
    }, [mode]);
    useEffect(() => {
        return () => {
            // Ensure wakelock is released when the component unmounts
            if (wakeLock.current) {
                wakeLock.current.release().catch((err) => {
                    console.error('Failed to release wake lock on unmount:', err);
                });
                wakeLock.current = null;
            }
        };
    }, []);

    const handleSettingsClick = (settings: SettingsValue) => {
        startTime.current = Date.now();
        const newSwimmers = Array.from({ length: settings.lanes }, () => makeSwimmer(settings));
        setSwimmers(newSwimmers);
        setSettings(settings);
        setViewMode(settings.simulationMode);
        setMode(Mode.SWIM);
        setOrderOfFinish([]);
    }

    const handleOrderOfFinishChange = useCallback((newOof: number[]) => {
        setOrderOfFinish(newOof);
    }, []);

    const isTestMode = typeof window !== 'undefined' && window.location.search.includes('testMode=true');

    useEffect(() => {
        if (isTestMode && typeof window !== 'undefined') {
            (window as unknown as { __TEST_SWIMMERS__: ISwimmer[] }).__TEST_SWIMMERS__ = swimmers;
        }
    }, [swimmers, isTestMode]);

    return (
        <>
            <div className="w-full flex flex-col min-h-screen">
                {mode !== Mode.SWIM && (
                    <Nav />
                )}
                <div hidden={mode !== Mode.SETTINGS} className="p-4 grow">
                    <Settings onClick={handleSettingsClick} />
                </div>
                {mode === Mode.SWIM && (
                    <div className="relative w-screen h-screen p-4"
                         data-swimmer-count={swimmers.length}
                         data-numbering={settings.numberingDirection}
                         data-starting-end={settings.startingEnd}>
                        {viewMode === "2D" ? (
                            <Pool
                                className="w-full h-full"
                                poolLength={settings.poolLength}
                                swimmers={swimmers}
                                numbering={settings.numberingDirection}
                                startingEnd={settings.startingEnd}
                                orderOfFinish={orderOfFinish}
                                onOrderOfFinishChange={handleOrderOfFinishChange} />
                        ) : (
                            <Pool3D
                                className="w-full h-full"
                                poolLength={settings.poolLength}
                                swimmers={swimmers}
                                numbering={settings.numberingDirection}
                                startingEnd={settings.startingEnd}
                                orderOfFinish={orderOfFinish}
                                onOrderOfFinishChange={handleOrderOfFinishChange} />
                        )}
                        <div data-testid="practice-controls" className={`absolute top-6 ${settings.startingEnd === StartingEnd.LEFT ? 'left-6' : 'right-6'} flex gap-4`}>
                            <ButtonGroup color="secondary" data-testid="view-selector">
                                <Button data-active={viewMode === "2D"} variant={viewMode === "2D" ? "solid" : "bordered"} onPress={() => setViewMode("2D")}>2D</Button>
                                <Button data-active={viewMode === "3D"} variant={viewMode === "3D" ? "solid" : "bordered"} onPress={() => setViewMode("3D")}>3D</Button>
                            </ButtonGroup>
                            <Button
                                color="primary"
                                onPress={() => setMode(Mode.SETTINGS)}
                            >
                                Back to Settings
                            </Button>
                        </div>
                    </div>
                )}
                {mode !== Mode.SWIM && (
                    <Footer />
                )}
            </div>
        </>
    );
}
