import { PoolLength } from "@/components/Pool/Pool";
import { Button, Form, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

export enum NumberingDirection {
    AWAY = "AWAY",
    TOWARDS = "TOWARDS",
}

export enum StartingEnd {
    LEFT = "LEFT",
    RIGHT = "RIGHT",
}

export enum SimulationMode {
    TWO_D = "2D",
    THREE_D = "3D",
}

// Valid values for selects
const LANE_OPTIONS = ["6", "8", "10"];
const RACE_LENGTH_OPTIONS = [
    { value: "50SC", label: "50 SC" },
    { value: "50LC", label: "50 LC" },
    { value: "500SC", label: "500 SC" },
    { value: "1000SC", label: "1000 SC" },
    { value: "1650SC", label: "1650 SC" },
    { value: "800LC", label: "800 LC" },
    { value: "1500LC", label: "1500 LC" },
];
const NUMBERING_OPTIONS = [
    { value: NumberingDirection.AWAY, label: "Bottom to top" },
    { value: NumberingDirection.TOWARDS, label: "Top to bottom" },
];
const STARTING_END_OPTIONS = [
    { value: StartingEnd.LEFT, label: "Left" },
    { value: StartingEnd.RIGHT, label: "Right" },
];
const MODE_OPTIONS = [
    { value: SimulationMode.TWO_D, label: "2D Overhead" },
    { value: SimulationMode.THREE_D, label: "3D Perspective" },
];
const DIFFICULTY_OPTIONS = [
    { value: "0.5", label: "Peaceful" },
    { value: "0.75", label: "Easy" },
    { value: "1", label: "Normal" },
    { value: "1.25", label: "Hard" },
    { value: "1.5", label: "Hardcore \uD83D\uDDA4" },
];
const SPREAD_OPTIONS = [
    { value: "0.05", label: "Minimal" },
    { value: "0.1", label: "Normal" },
    { value: "0.2", label: "Max" },
];

/** Configuration for a race */
export type SettingsValue = {
    /** The length of the swimming pool */
    poolLength: PoolLength;
    /** The number of lanes in the pool */
    lanes: number;
    /** The number of laps in the race */
    laps: number;
    /** A difficulty multiplier */
    difficulty: number;
    /** The maximum percentage difference of the swimmers' speeds */
    spread: number;
    /** The direction for lane numbering */
    numberingDirection: NumberingDirection;
    /** The side of the screen the start/finish wall is on */
    startingEnd: StartingEnd;
    /** The simulation rendering mode */
    simulationMode: SimulationMode;
};

export type SettingsProps = {
    /** Callback that is invoked to finalize the settings for a race */
    onClick: (settings: SettingsValue) => void;
};

export default function Settings(props: SettingsProps) {
    const [raceLength, setRaceLength] = useState<string>("500SC");
    const [lanes, setLanes] = useState<number>(8);
    const [difficulty, setDifficulty] = useState<number>(1.0);
    const [numberingDirection, setNumberingDirection] = useState<NumberingDirection>(NumberingDirection.AWAY);
    const [startingEnd, setStartingEnd] = useState<StartingEnd>(StartingEnd.LEFT);
    const [simulationMode, setSimulationMode] = useState<SimulationMode>(SimulationMode.THREE_D);
    // Spread is the percentage difference in speed between the fastest and
    // slowest swimmers
    const [spread, setSpread] = useState<number>(0.1);
    const isTestMode = typeof window !== 'undefined' && window.location.search.includes('testMode=true');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const poolLength = raceLength.slice(-2) as PoolLength;
        const distance = parseInt(raceLength.slice(0, -2));
        const laps = poolLength === PoolLength.SC ? distance / 25 : distance / 50;
        props.onClick({
            poolLength,
            lanes,
            laps,
            difficulty,
            spread,
            numberingDirection,
            startingEnd,
            simulationMode,
        });
    }

    return (
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Form onSubmit={handleSubmit} className={`flex flex-col items-center ${isTestMode ? "gap-32" : "gap-6"}`}>
                <div className={`grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full ${isTestMode ? "pb-64" : ""}`}>
                    <Select
                        data-testid="settings-Number of Lanes"
                        label="Number of Lanes"
                        selectedKeys={new Set([lanes.toString()])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setLanes(parseInt(selected.toString()));
                        }}>
                        {LANE_OPTIONS.map(opt => (
                            <SelectItem key={opt}>{opt}</SelectItem>
                        ))}
                    </Select>

                    {isTestMode ? (
                        <div className="flex flex-col gap-2 w-full">
                            <label className="text-small">Race Length</label>
                            <select
                                data-testid="settings-Race Length"
                                value={raceLength}
                                onChange={(e) => setRaceLength(e.target.value)}
                                className="bg-content1 rounded-medium p-2 border-1"
                            >
                                {RACE_LENGTH_OPTIONS.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <Select
                            data-testid="settings-Race Length"
                            label="Race Length"
                            disallowEmptySelection
                            selectedKeys={new Set([raceLength])}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0];
                                if (selected) setRaceLength(selected.toString());
                            }}>
                            {RACE_LENGTH_OPTIONS.map(opt => (
                                <SelectItem key={opt.value}>{opt.label}</SelectItem>
                            ))}
                        </Select>
                    )}

                    <Select
                        data-testid="settings-Lane Numbering"
                        label="Lane Numbering"
                        selectedKeys={new Set([numberingDirection])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setNumberingDirection(selected.toString() as NumberingDirection);
                        }}>
                        {NUMBERING_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        data-testid="settings-Difficulty"
                        label="Difficulty"
                        selectedKeys={new Set([difficulty.toString()])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setDifficulty(parseFloat(selected.toString()));
                        }}>
                        {DIFFICULTY_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        data-testid="settings-Spread"
                        label="Spread"
                        selectedKeys={new Set([spread.toString()])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setSpread(parseFloat(selected.toString()));
                        }}>
                        {SPREAD_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        data-testid="settings-Starting End"
                        label="Starting End"
                        selectedKeys={new Set([startingEnd])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setStartingEnd(selected.toString() as StartingEnd);
                        }}>
                        {STARTING_END_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        data-testid="settings-Simulation Mode"
                        label="Simulation Mode"
                        selectedKeys={new Set([simulationMode])}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setSimulationMode(selected.toString() as SimulationMode);
                        }}>
                        {MODE_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                </div>
                <Button
                    color="primary"
                    type="submit"
                    data-testid="start-button"
                >
                    Start
                </Button>
            </Form>
        </div >
    )
}
