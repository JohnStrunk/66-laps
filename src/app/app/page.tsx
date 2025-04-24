'use client'

import Pool, { PoolLength } from "@/components/Pool/Pool";
import Settings, { NumberingDirection, SettingsValue } from "@/components/Settings/Settings";
import { ISwimmer, SwimmerModel } from "@/modules/SwimmerModel";
import { Button } from "@headlessui/react";
import { useEffect, useState } from "react";

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

    // For small screens, request fullscreen when we start the simulation.
    useEffect(() => {
        if (mode === Mode.SWIM && window.innerWidth <= 768) {
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
                <div className="relative w-screen h-screen">
                    <Pool
                        className="absolute inset-0 w-full h-full"
                        poolLength={settings.poolLength}
                        swimmers={swimmers}
                        numbering={settings.numberingDirection} />
                    <div className="absolute top-4 right-4">
                        <Button
                            onClick={() => setMode(Mode.SETTINGS)}
                            className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg shadow-black/70"
                        >
                            Back to Settings
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
