'use client'

import Pool, { PoolLength } from "@/components/Pool/Pool";
import Settings, { NumberingDirection, SettingsValue } from "@/components/Settings/Settings";
import { ISwimmer, SwimmerModel } from "@/modules/SwimmerModel";
import { Button } from "@heroui/react";

import { useEffect, useRef, useState } from "react";

enum Mode {
    SETTINGS = "SETTINGS",
    SWIM = "SWIM",
}

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
    return new SwimmerModel(lapTimes, Date.now());
}

export default function Page() {
    const [mode, setMode] = useState<Mode>(Mode.SETTINGS);
    const [swimmers, setSwimmers] = useState<ISwimmer[]>([]);
    const [settings, setSettings] = useState<SettingsValue>({
        // dummy values
        poolLength: PoolLength.SC,
        lanes: 8,
        laps: 20,
        difficulty: 1.0,
        spread: 0.05,
        numberingDirection: NumberingDirection.AWAY,
    });
    const wakeLock = useRef<WakeLockSentinel | null>(null);

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
        const newSwimmers = Array.from({ length: settings.lanes }, () => makeSwimmer(settings));
        setSwimmers(newSwimmers);
        setSettings(settings);
        setMode(Mode.SWIM);
    }

    return (
        <div>
            <div hidden={mode !== Mode.SETTINGS} className="p-4">
                <Settings onClick={handleSettingsClick} />
            </div>
            {mode === Mode.SWIM && (
                <div className="relative w-screen h-screen p-4">
                    <Pool
                        className="w-full h-full"
                        poolLength={settings.poolLength}
                        swimmers={swimmers}
                        numbering={settings.numberingDirection} />
                    <div className="absolute top-6 right-6">
                        <Button
                            color="primary"
                            onPress={() => setMode(Mode.SETTINGS)}
                        >
                            Back to Settings
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
