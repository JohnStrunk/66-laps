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
    { value: "1.5", label: "Hardcore 🖤" },
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

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const poolLength = raceLength.slice(-2) as PoolLength;
        const distance = parseInt(raceLength.slice(0, -2));
        const laps = poolLength === "SC" ? distance / 25 : distance / 50;
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
            <Form onSubmit={handleSubmit} className="flex flex-col items-center">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
                    <Select
                        data-testid="settings-Number of Lanes"
                        label="Number of Lanes"
                        selectedKeys={new Set([lanes.toString()])}
                        validate={(value) => {
                            if (value === "" || value === null || value === undefined) {
                                return "Please select a number of lanes";
                            }
                            const stringValue = typeof value === 'object' && 'entries' in value ? Array.from(value as Iterable<unknown>)[0] : Array.isArray(value) ? value[0] : value;
                            if (!LANE_OPTIONS.includes(String(stringValue))) {
                                return "Please select a valid number of lanes";
                            }
                            return true;
                        }}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setLanes(parseInt(selected.toString()));
                        }}>
                        {LANE_OPTIONS.map(opt => (
                            <SelectItem key={opt}>{opt}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        data-testid="settings-Race Length"
                        label="Race Length"
                        selectedKeys={new Set([raceLength])}
                        validate={(value) => {
                            if (value === "" || value === null || value === undefined) {
                                return "Please select a race length";
                            }
                            const stringValue = typeof value === 'object' && 'entries' in value ? Array.from(value as Iterable<unknown>)[0] : Array.isArray(value) ? value[0] : value;
                            if (!RACE_LENGTH_OPTIONS.some(opt => opt.value === String(stringValue))) {
                                return "Please select a valid race length";
                            }
                            return true;
                        }}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected) setRaceLength(selected.toString());
                        }}>
                        {RACE_LENGTH_OPTIONS.map(opt => (
                            <SelectItem key={opt.value}>{opt.label}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        data-testid="settings-Lane Numbering"
                        label="Lane Numbering"
                        selectedKeys={new Set([numberingDirection])}
                        validate={(value) => {
                            if (value === "" || value === null || value === undefined) {
                                return "Please select a lane numbering direction";
                            }
                            const stringValue = typeof value === 'object' && 'entries' in value ? Array.from(value as Iterable<unknown>)[0] : Array.isArray(value) ? value[0] : value;
                            if (!NUMBERING_OPTIONS.some(opt => opt.value === String(stringValue))) {
                                return "Please select a valid numbering direction";
                            }
                            return true;
                        }}
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
                        validate={(value) => {
                            if (value === "" || value === null || value === undefined) {
                                return "Please select a difficulty level";
                            }
                            const stringValue = typeof value === 'object' && 'entries' in value ? Array.from(value as Iterable<unknown>)[0] : Array.isArray(value) ? value[0] : value;
                            if (!DIFFICULTY_OPTIONS.some(opt => opt.value === String(stringValue))) {
                                return "Please select a valid difficulty level";
                            }
                            return true;
                        }}
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
                        validate={(value) => {
                            if (value === "" || value === null || value === undefined) {
                                return "Please select a speed spread";
                            }
                            const stringValue = typeof value === 'object' && 'entries' in value ? Array.from(value as Iterable<unknown>)[0] : Array.isArray(value) ? value[0] : value;
                            if (!SPREAD_OPTIONS.some(opt => opt.value === String(stringValue))) {
                                return "Please select a valid speed spread";
                            }
                            return true;
                        }}
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
                        validate={(value) => {
                            if (value === "" || value === null || value === undefined) {
                                return "Please select a starting end";
                            }
                            const stringValue = typeof value === 'object' && 'entries' in value ? Array.from(value as Iterable<unknown>)[0] : Array.isArray(value) ? value[0] : value;
                            if (!STARTING_END_OPTIONS.some(opt => opt.value === String(stringValue))) {
                                return "Please select a valid starting end";
                            }
                            return true;
                        }}
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
                        validate={(value) => {
                            if (value === "" || value === null || value === undefined) {
                                return "Please select a simulation mode";
                            }
                            const stringValue = typeof value === 'object' && 'entries' in value ? Array.from(value as Iterable<unknown>)[0] : Array.isArray(value) ? value[0] : value;
                            if (!MODE_OPTIONS.some(opt => opt.value === String(stringValue))) {
                                return "Please select a valid simulation mode";
                            }
                            return true;
                        }}
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
